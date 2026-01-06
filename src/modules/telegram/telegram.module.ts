import { Module, Provider } from '@nestjs/common';
import { TELEGRAM_HANDLERS, TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TelegramUpdateHandler } from './types/telegram-bot.interface';
import { botHandlers } from './handlers';

const handlersProviders: Provider<TelegramUpdateHandler>[] = [...botHandlers];

@Module({
  controllers: [TelegramController],
  providers: [
    TelegramService,
    ...handlersProviders,
    {
      provide: TELEGRAM_HANDLERS,
      useFactory: (...handlers: TelegramUpdateHandler[]) => handlers,
      inject: botHandlers,
    },
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
