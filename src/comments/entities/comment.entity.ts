import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'comments',
  timestamps: true,
  underscored: true,
})
export class Comment extends Model<Comment> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
    },
  })
  declare content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare user_id: string;

  @BelongsTo(() => User, 'user_id')
  declare user: User;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}

