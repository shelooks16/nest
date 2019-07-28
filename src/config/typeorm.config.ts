import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: '123',
  database: 'admin',
  entities: [__dirname + '../**/*.entity.{ts,js}'],
  synchronize: true
};

export default typeOrmConfig;
