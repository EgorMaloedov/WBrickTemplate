import { DataSource } from 'typeorm';
import { WBrickConfigService } from '../config/config.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('DatabaseProvider');

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (config: WBrickConfigService): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        username: config.db.username,
        password: config.db.password,
        database: config.db.name,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: config.db.sync,
      });

      try {
        await dataSource.initialize();
        logger.log('Успешно подключились к Postgres');
        return dataSource;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        logger.error('Не удалось подключиться к Postgres', error.stack);
        throw error;
      }
    },
    inject: [WBrickConfigService],
  },
];
