import { Module } from '@nestjs/common';
import { WBrickConfigModule } from './shared/config/config.module';
import { WBrickDatabaseModule } from './shared/database/database.module';
import { WBrickCacheModule } from './shared/cache/cache.module';
import { NgrokModule } from './shared/ngrok/ngrok.module';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    WBrickConfigModule,
    WBrickDatabaseModule,
    WBrickCacheModule,
    NgrokModule,
    TelegramModule,
  ],
})
export class AppModule {}
