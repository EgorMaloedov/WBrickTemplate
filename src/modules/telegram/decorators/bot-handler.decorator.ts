// decorators/bot-handler.decorator.ts
import { Injectable, SetMetadata } from '@nestjs/common';
import { BOT_HANDLER_METADATA } from '../telegram.constants';

export function BotHandler(): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return (target: Function) => {
    Injectable()(target);
    SetMetadata(BOT_HANDLER_METADATA, true)(target);
  };
}
