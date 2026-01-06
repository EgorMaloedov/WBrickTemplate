/* eslint-disable*/

import { Logger } from '@nestjs/common';
import IORedis from 'ioredis';
import { WBrickConfigService } from '../config/config.service';

const logger = new Logger('RedisProvider');

export const redisProviders = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: (config: WBrickConfigService) => {
      const client = new IORedis({
        host: config.cache.host,
        port: config.cache.port,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          return Math.min(times * 100, 3000);
        },
        reconnectOnError() {
          return true;
        },
      }) as any;
      client.on('connect', () => logger.log('Успешно подключились к Redis'));
      client.on('ready', () => logger.log('Redis готов'));
      client.on('error', (err: any) => logger.error('Ошибка Redis: ', err));
      client.on('close', () => logger.warn('Закрылось соединение с Redis'));
      client.on('reconnecting', () => logger.log('Переподключение к Redis...'));

      return client;
    },
    inject: [WBrickConfigService],
  },
];
