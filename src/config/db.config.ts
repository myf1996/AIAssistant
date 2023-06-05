import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { systemConfig } from './system.config';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: systemConfig.database.db_host,
  port: systemConfig.database.db_port,
  username: systemConfig.database.db_username,
  password: systemConfig.database.db_password,
  database: systemConfig.database.db_database,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
});
