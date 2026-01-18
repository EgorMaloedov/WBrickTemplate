import { Scenes } from 'telegraf';
import { BotScene } from '../scene.decorator';
import { Injectable } from '@nestjs/common';
import { IBotScene } from '../types/scene.interface';
import { MyContext } from '../types/context.interface';
import { StartHandler } from '../handlers/start.handler';

@Injectable()
@BotScene()
export class RegistrationScene implements IBotScene {
  constructor(private readonly startHandler: StartHandler) {}

  getScene() {
    return new Scenes.WizardScene<MyContext>(
      'REGISTRATION_SCENE_ID',
      async (ctx) => {
        if (ctx.update['callback_query'] && !ctx.session.lastMessageId)
          ctx.session.lastMessageId =
            ctx.update['callback_query']['message']?.message_id;

        await ctx.answerCbQuery();
        await ctx.editMessageText(
          'Привет! Давай зарегистрируемся. Как тебя зовут?',
        );

        return ctx.wizard.next();
      },
      async (ctx) => {
        if (ctx.message) {
          await ctx.deleteMessage(ctx.message.message_id).catch(() => null);
        }

        if (ctx.session.lastMessageId) {
          await ctx.deleteMessage(ctx.session.lastMessageId).catch(() => null);
          ctx.session.lastMessageId = undefined;
        }

        ctx.session.status = 'active';

        await this.startHandler.handle(ctx);

        return ctx.scene.leave();
      },
    );
  }
}
