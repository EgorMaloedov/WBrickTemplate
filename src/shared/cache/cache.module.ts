import { Module } from '@nestjs/common';
import { redisProviders } from './redis.provider';

@Module({
  providers: [...redisProviders],
  exports: [...redisProviders],
})
export class WBrickCacheModule {}
