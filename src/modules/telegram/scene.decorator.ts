import { SetMetadata } from '@nestjs/common';

export const TELEGRAM_SCENE_METADATA = 'TELEGRAM_SCENE_METADATA';
// Декоратор помечает класс как сцену Telegraf
export const BotScene = () => SetMetadata(TELEGRAM_SCENE_METADATA, true);
