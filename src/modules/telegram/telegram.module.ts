// telegraf.module.ts
import { Module, Global } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { DiscoveryService } from '@nestjs/core';
import { StartHandler } from './handlers/start.handler';
import { AdminStatsActionHandler } from './handlers/admin/actions/admin-stat.action.handler';
import { AdminSettingsActionHandler } from './handlers/admin/actions/admin-settings.action.handler';
import { AdminBroadcastActionHandler } from './handlers/admin/actions/admin-broadcast.action.handler';
import { AdminReloadActionHandler } from './handlers/admin/actions/admin-reload.action.handler';
import { UserHelpActionHandler } from './handlers/user/actions/user-help.action.handler';
import { UserSubscribeActionHandler } from './handlers/user/actions/user-subscribe.action.handler';
import { BackToMainMenuActionHandler } from './handlers/common/actions/back.action.handler';
import { WBrickCacheModule } from 'src/shared/cache/cache.module';
import { RegistrationScene } from './scenes/register.scene';

@Global()
@Module({
  imports: [WBrickCacheModule],
  providers: [
    TelegramService,
    DiscoveryService,
    StartHandler,
    AdminStatsActionHandler,
    AdminSettingsActionHandler,
    AdminBroadcastActionHandler,
    AdminReloadActionHandler,
    UserHelpActionHandler,
    UserSubscribeActionHandler,
    BackToMainMenuActionHandler,
    RegistrationScene,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
