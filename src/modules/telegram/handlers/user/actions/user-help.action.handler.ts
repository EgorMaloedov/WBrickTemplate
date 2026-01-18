import { Injectable } from '@nestjs/common';
import { BotHandler } from '../../../telegram-handler.decorator';
import { TelegramHandler } from '../../../types/telegram-handler.interface';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { Context, Markup } from 'telegraf';

@Injectable()
@BotHandler()
export class UserHelpActionHandler implements TelegramHandler {
  constructor(private readonly config: WBrickConfigService) {}

  getCommand(): string {
    return 'action:user_help';
  }

  async handle(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Помощь',
      Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]]),
    );
  }
}
