import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  username: string;

  @Column('text')
  password: string;

  async isPasswordMatches(password): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
