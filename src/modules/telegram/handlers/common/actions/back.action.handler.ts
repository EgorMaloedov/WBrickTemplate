import { Injectable } from '@nestjs/common';
import { BotHandler } from '../../../telegram-handler.decorator';
import { TelegramHandler } from '../../../types/telegram-handler.interface';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { StartHandler } from '../../start.handler';
import { MyContext } from 'src/modules/telegram/types/context.interface';

@Injectable()
@BotHandler()
export class BackToMainMenuActionHandler implements TelegramHandler {
  constructor(
    private readonly config: WBrickConfigService,
    private readonly startHandler: StartHandler,
  ) {}

  getCommand(): string {
    return 'action:back';
  }

  async handle(ctx: MyContext): Promise<void> {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    await this.startHandler.handle(ctx);
  }
}
