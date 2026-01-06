import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WBrickConfigService } from './shared/config/config.service';
import { NgrokService } from './shared/ngrok/ngrok.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ngrokService = app.get(NgrokService);

  await ngrokService.start();

  await app.init();

  app.enableShutdownHooks();

  const config = app.get(WBrickConfigService);

  const shutdown = async (signal: string) => {
    logger.log(`Получен сигнал завершения: ${signal}`);
    await app.close();
    logger.log('Приложение успешно завершено');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  const port = config.app.port;
  await app.listen(port);
  logger.log(`Приложение запущено на порту ${port}`);
}

bootstrap().catch((err) => {
  logger.error('Критическая ошибка при запуске приложения', err);
  process.exit(1);
});
