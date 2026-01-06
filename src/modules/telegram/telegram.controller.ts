import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import * as typescriptTelegramBotApi from 'typescript-telegram-bot-api';
import { WBrickConfigService } from 'src/shared/config/config.service';

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegram: TelegramService,
    private readonly config: WBrickConfigService,
  ) {}

  @Post('/bot/webhook')
  async webhook(
    @Body() update: typescriptTelegramBotApi.Update,
    @Headers('X-Telegram-Bot-Api-Secret-Token') secretToken: string,
  ) {
    if (secretToken !== this.config.telegram.secretToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.telegram.bot.processUpdate(update);
    } catch (e) {
      console.error('Ошибка обработки вебхука:', e);
      throw new HttpException(
        'Webhook processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
