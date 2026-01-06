import { User } from 'typescript-telegram-bot-api';

declare module 'typescript-telegram-bot-api' {
  interface TelegramBot {
    info: User;
  }
}
