import { Injectable } from '@nestjs/common';
import { BotHandler } from '../../../telegram-handler.decorator';
import { TelegramHandler } from '../../../types/telegram-handler.interface';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { Context, Markup } from 'telegraf';

@Injectable()
@BotHandler()
export class AdminSettingsActionHandler implements TelegramHandler {
  constructor(private readonly config: WBrickConfigService) {}

  getCommand(): string {
    return 'action:admin_settings';
  }

  async handle(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Настройки',
      Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]]),
    );
  }
}
