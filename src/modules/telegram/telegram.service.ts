import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TelegramBot } from 'typescript-telegram-bot-api';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { TelegramUpdateHandler } from './types/telegram-bot.interface';

export const TELEGRAM_HANDLERS = 'TELEGRAM_HANDLERS';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  public readonly bot: TelegramBot;

  constructor(
    private readonly config: WBrickConfigService,
    @Inject(TELEGRAM_HANDLERS)
    private readonly handlers: TelegramUpdateHandler[],
  ) {
    this.bot = new TelegramBot({
      botToken: this.config.telegram.token,
    });
  }

  async onModuleInit() {
    try {
      this.bot.info = await this.bot.getMe();
      this.logger.log(
        `Бот ${this.bot.info.first_name} (@${this.bot.info.username}) успешно запущен`,
      );

      await this.bot.setWebhook({
        url: `${this.config.app.publicUrl}/telegram/bot/webhook`,
        secret_token: this.config.telegram.secretToken,
      });

      this.handlers.forEach((h) => h.register(this.bot));
    } catch (e) {
      this.logger.error('Ошибка инициализации Telegram бота', e);
      throw e;
    }
  }

  public getBot(): TelegramBot {
    return this.bot;
  }
}
