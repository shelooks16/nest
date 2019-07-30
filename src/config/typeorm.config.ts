import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME || 'localhost',
  port: process.env.RDS_PORT || 5432,
  username: process.env.RDS_USERNAME || 'admin',
  password: process.env.RDS_PASSWORD || '123',
  database: process.env.RDS_DB_NAME || 'admin',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: process.env.TYPEORM_SYNC || true
} as TypeOrmModuleOptions;

export default typeOrmConfig;
