// src/modules/properties/properties.service.ts
import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { UserRole } from '../users/entities/user.entity';
import { Op } from 'sequelize';
import { SocialAssistance } from '../social-assistance/entities/social-assistance.entity'; 
import { SocialAssistanceService } from '../social-assistance/social-assistance.service'; 

interface PropertyWithPending extends Property {
  has_pending_bookings?: boolean;
}

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property)
    private propertyModel: typeof Property,

    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Booking)
    private bookingModel: typeof Booking,

    private readonly socialAssistanceService?: SocialAssistanceService, 
  ) {
    console.log('[PROPERTIES SERVICE] Construtor chamado');
    console.log('[PROPERTIES SERVICE] propertyModel injetado:', !!this.propertyModel);
    
    // Teste direto do modelo
    this.testModel();
  }

  private async testModel() {
    try {
      console.log('[PROPERTIES SERVICE] Testando modelo...');
      const count = await this.propertyModel.count();
      console.log('[PROPERTIES SERVICE] Total de propriedades no banco:', count);
    } catch (error: any) {
      console.error('[PROPERTIES SERVICE] Erro ao testar modelo:', error.message);
    }
  }

  async create(ownerId: string, createPropertyDto: CreatePropertyDto): Promise<Property> {
    console.log('[PROPERTIES SERVICE] create chamado com ownerId:', ownerId);
    console.log('[PROPERTIES SERVICE] createPropertyDto:', createPropertyDto);
    
    const owner = await this.userModel.findByPk(ownerId);
    console.log('[PROPERTIES SERVICE] owner encontrado:', owner ? owner.role : 'não encontrado');

    if (!owner) {
      throw new UnauthorizedException('User not found.');
    }

    if (owner.role !== UserRole.SUPPLIER && owner.role !== UserRole.ADMIN) { 
      throw new UnauthorizedException('Only suppliers and admins can create properties.');
    }

    // Validação de social_assistance_id
    if (createPropertyDto.social_assistance_id && this.socialAssistanceService) {
      const socialAssistanceExists = await this.socialAssistanceService.findById(createPropertyDto.social_assistance_id);
      if (!socialAssistanceExists) {
        throw new NotFoundException(`Social Assistance with ID ${createPropertyDto.social_assistance_id} not found.`);
      }
    }

    return this.propertyModel.create({ ...createPropertyDto, owner_id: ownerId } as any);
  }

  async findAll(filters: { name?: string; location?: string } = {}): Promise<PropertyWithPending[]> {
    console.log('[PROPERTIES SERVICE] findAll chamado com filtros:', filters);
    
    const whereClause: any = {};
    if (filters.name) {
      whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    }
    if (filters.location) {
      whereClause.location = { [Op.iLike]: `%${filters.location}%` };
    }

    const properties = await this.propertyModel.findAll({
      where: whereClause,
      include: [Booking, SocialAssistance],
    });

    console.log('[PROPERTIES SERVICE] findAll retornou:', properties.length, 'propriedades');
    
    // Log dos IDs para debug
    properties.forEach((prop, index) => {
      console.log(`[PROPERTIES SERVICE] Propriedade ${index + 1}: ID=${prop.id}, Nome=${prop.name}`);
    });

    return properties.map((property) => {
      const hasPending = property.bookings.some(
        (booking) => booking.status === 'pending',
      );
      
      // Retornar diretamente o objeto do Sequelize sem Object.assign
      const propertyData = property.toJSON();
      (propertyData as any).has_pending_bookings = hasPending;
      
      return propertyData as PropertyWithPending;
    });
  }

  async findOne(id: string): Promise<PropertyWithPending> {
    console.log('[PROPERTIES SERVICE] findOne chamado com ID:', id);
    
    // Usar uma query mais simples sem includes
    const property = await this.propertyModel.findOne({
      where: { id: id }
    });
    
    console.log('[PROPERTIES SERVICE] Resultado do findOne:', property ? 'encontrado' : 'não encontrado');

    if (!property) {
      console.log('[PROPERTIES SERVICE] Propriedade não encontrada, lançando NotFoundException');
      throw new NotFoundException('Property not found');
    }

    // Buscar bookings separadamente para evitar problemas de relação
    const bookings = await this.bookingModel.findAll({
      where: { property_id: id }
    });

    const hasPending = bookings.some(
      (booking) => booking.status === 'pending',
    );

    // Retornar diretamente o objeto do Sequelize sem Object.assign
    const propertyData = property.toJSON();
    (propertyData as any).has_pending_bookings = hasPending;
    
    console.log('[PROPERTIES SERVICE] Propriedade retornada com sucesso');
    return propertyData as PropertyWithPending;
  }

  async update(ownerId: string, id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    if (property.owner_id !== ownerId) {
      throw new UnauthorizedException('You are not the owner of this property.');
    }

    // Validação social_assistance_id em update
    if (updatePropertyDto.social_assistance_id && this.socialAssistanceService) {
      const socialAssistanceExists = await this.socialAssistanceService.findById(updatePropertyDto.social_assistance_id);
      if (!socialAssistanceExists) {
        throw new NotFoundException(`Social Assistance with ID ${updatePropertyDto.social_assistance_id} not found.`);
      }
    }

    await this.propertyModel.update(updatePropertyDto, {
      where: { id },
    });

    const updatedProperty = await this.propertyModel.findByPk(id);
    return updatedProperty!;
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const property = await this.propertyModel.findByPk(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    if (property.owner_id !== ownerId) {
      throw new UnauthorizedException('You are not authorized to delete this property.');
    }

    await this.propertyModel.destroy({
      where: { id },
    });
  }

  async findBySupplierId(supplierId: string): Promise<Property[]> {
    return this.propertyModel.findAll({ where: { owner_id: supplierId } });
  }
}