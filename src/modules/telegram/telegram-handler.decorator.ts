// telegram-handler.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TELEGRAM_HANDLER_METADATA } from './types/telegram-handler.interface';

export const BotHandler = () => SetMetadata(TELEGRAM_HANDLER_METADATA, true);
