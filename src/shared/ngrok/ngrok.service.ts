import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { WBrickConfigService } from '../config/config.service';
import ngrok from '@ngrok/ngrok';

@Injectable()
export class NgrokService implements OnApplicationShutdown {
  private readonly logger = new Logger(NgrokService.name);
  private listener: ngrok.Listener | null = null;

  constructor(private config: WBrickConfigService) {}

  async start(): Promise<void> {
    if (this.config.ngrok?.requireNgrok !== true) {
      this.logger.log('Ngrok отключен в конфигурации');
      return;
    }

    if (this.listener) {
      this.logger.warn('Попытка повторного запуска ngrok — уже активен');
      return;
    }

    try {
      this.logger.log('Создаём ngrok-туннель...');

      this.listener = await ngrok.forward({
        addr: this.config.app.port,
        authtoken: this.config.ngrok.authToken,
      });

      this.logger.log(`Ngrok туннель успешно создан: ${this.listener.url()}`);
    } catch (error) {
      this.logger.error('Ошибка при создании ngrok-туннеля', error);
      throw error;
    }
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (!this.listener) return;

    this.logger.log(`Закрываем ngrok-туннель (сигнал: ${signal || 'unknown'})`);

    try {
      await this.listener.close();
      this.logger.log('Ngrok туннель успешно закрыт');
    } catch (error) {
      this.logger.error('Ошибка при закрытии ngrok-туннеля', error);
    } finally {
      this.listener = null;
    }
  }

  get url(): string | null {
    return this.listener?.url() ?? null;
  }

  get isActive(): boolean {
    return !!this.listener;
  }

  async forceClose(): Promise<void> {
    if (!this.listener) return;
    await this.onApplicationShutdown('manual-force');
  }
}
