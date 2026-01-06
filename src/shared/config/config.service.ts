import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './types'; // путь подправь, если нужно

@Injectable()
export class WBrickConfigService implements AppConfig {
  readonly app: AppConfig['app'];
  readonly telegram: AppConfig['telegram'];
  readonly ngrok: AppConfig['ngrok'];
  readonly cache: AppConfig['cache'];
  readonly crypto: AppConfig['crypto'];
  readonly db: AppConfig['db'];

  constructor(private readonly configService: ConfigService<AppConfig>) {
    this.app = this.configService.getOrThrow<AppConfig['app']>('app');
    this.telegram =
      this.configService.getOrThrow<AppConfig['telegram']>('telegram');
    this.ngrok = this.configService.getOrThrow<AppConfig['ngrok']>('ngrok');
    this.cache = this.configService.getOrThrow<AppConfig['cache']>('cache');
    this.crypto = this.configService.getOrThrow<AppConfig['crypto']>('crypto');
    this.db = this.configService.getOrThrow<AppConfig['db']>('db');
  }
}
