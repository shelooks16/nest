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

  @Column()
  username: string;

  @Column('text')
  password: string;

  async isPasswordMatches(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
