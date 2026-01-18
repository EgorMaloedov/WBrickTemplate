import { Injectable } from '@nestjs/common';
import { BotHandler } from '../../../telegram-handler.decorator';
import { TelegramHandler } from '../../../types/telegram-handler.interface';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { Markup } from 'telegraf';
import { MyContext } from 'src/modules/telegram/types/context.interface';

@Injectable()
@BotHandler()
export class AdminBroadcastActionHandler implements TelegramHandler {
  constructor(private readonly config: WBrickConfigService) {}

  getCommand(): string {
    return 'action:admin_broadcast';
  }

  async handle(ctx: MyContext): Promise<void> {
    // const currentCounter = ctx.session?.counter ?? 0;

    // ctx.session = {
    //   ...ctx.session,
    //   counter: currentCounter + 1,
    // };

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `Рассылка`,
      Markup.inlineKeyboard([[Markup.button.callback('Назад', 'back')]]),
    );
  }
}
