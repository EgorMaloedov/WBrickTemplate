import { TelegramBot } from 'typescript-telegram-bot-api';
import { BotHandler } from '../decorators/bot-handler.decorator';
import { TelegramUpdateHandler } from '../types/telegram-bot.interface';

@BotHandler()
export class StartCommandHandler implements TelegramUpdateHandler {
  constructor() {}

  register(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      if (!msg.text || !msg.text.startsWith('/start')) {
        return;
      }

      const command = msg.text.split(' ')[0];
      const expectedCommand = '/start';

      const username = bot.info.username;
      if (
        command === expectedCommand ||
        (username && command === `${expectedCommand}@${username}`)
      ) {
        await bot.sendMessage({
          chat_id: msg.chat.id,
          text: 'Привет! Это команда /start.',
        });
      }
    });
  }
}
