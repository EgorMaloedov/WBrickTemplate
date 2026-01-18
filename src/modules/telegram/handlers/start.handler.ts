import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { TelegramHandler } from '../types/telegram-handler.interface';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { BotHandler } from '../telegram-handler.decorator';
import { MyContext } from '../types/context.interface';

@Injectable()
@BotHandler()
export class StartHandler implements TelegramHandler {
  constructor(private readonly config: WBrickConfigService) {}

  getCommand(): string {
    return 'command:start';
  }

  async handle(ctx: MyContext): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const isAdmin = String(userId) === String(this.config.telegram.botAdminId);
    const isRegistered = ctx.session?.status === 'active';

    // 1. Базовые кнопки, общие для админа и зарезанного юзера
    const commonButtons = [
      Markup.button.callback('📅 Календарь акций', 'user_subscribe'),
      Markup.button.callback('❓ Помощь', 'user_help'),
      Markup.button.callback('⚙️ Настройки', 'user_settings'),
    ];

    const channelButton = [
      Markup.button.url('📢 Наш канал', 'https://t.me/wildbridge'),
    ];

    // 2. Специфичные кнопки
    const adminButtons = [
      Markup.button.callback('📊 Статистика', 'admin_stats'),
      Markup.button.callback('📤 Рассылка', 'admin_broadcast'),
    ];

    const registrationButton = [
      Markup.button.callback(
        '🔑 Добавить токен (Авторизация)',
        'REGISTRATION_SCENE_ID',
      ),
    ];

    let text = `<b>WildBricks</b> 🧱\n\n`;
    let buttons: any[] = [];

    // 3. Сборка интерфейса
    if (isAdmin) {
      text += `Вы авторизованы как <b>Администратор</b> 👑\nВам доступны все функции системы.`;
      buttons = [commonButtons, channelButton, adminButtons];
    } else if (isRegistered) {
      text += `С возвращением! Выберите нужный раздел в меню.`;
      buttons = [
        [commonButtons[0], commonButtons[1]], // Календарь и Помощь в ряд
        [commonButtons[2]], // Настройки отдельно
        channelButton,
      ];
    } else {
      text += `Для доступа к функциям <b>календаря</b> и <b>настроек</b> необходимо авторизоваться.`;
      buttons = [
        registrationButton,
        [commonButtons[1]], // Только кнопка "Помощь"
        channelButton,
      ];
    }

    await ctx.replyWithHTML(text, Markup.inlineKeyboard(buttons));
  }
}
