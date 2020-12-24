import { ConnectionOptions } from 'typeorm';

import config from './config';

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port),
  username: config.db.user,
  password: config.db.pass,
  database: config.db.name,
  entities:
    config.env === 'test'
      ? ['./src/**/*.entity{.ts,.js}']
      : ['./dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
  logger: 'simple-console',
};

export default ormConfig;
