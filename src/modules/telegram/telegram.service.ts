import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
} from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Update } from 'node_modules/telegraf/typings/core/types/typegram';
import { WBrickConfigService } from 'src/shared/config/config.service';
import { Telegraf, Context, NarrowedContext, session, Scenes } from 'telegraf';
import { TELEGRAM_HANDLER_METADATA } from './types/telegram-handler.interface';
import { Triggers } from 'node_modules/telegraf/typings/composer';
import { Redis } from '@telegraf/session/redis';
import { MyContext, MySessionData } from './types/context.interface';
import { TELEGRAM_SCENE_METADATA } from './scene.decorator';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf<MyContext>;

  constructor(
    private readonly config: WBrickConfigService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {
    // В конструкторе только создаем инстанс
    this.bot = new Telegraf<MyContext>(config.telegram.token, {
      telegram: { webhookReply: false },
    });
  }

  private registerHandlers() {
    const providers: InstanceWrapper<any>[] =
      this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;

      if (!instance || !metatype) continue;

      const isTelegramHandler = this.reflector.get(
        TELEGRAM_HANDLER_METADATA,
        metatype,
      );

      if (isTelegramHandler) {
        if (typeof instance.getCommand !== 'function') {
          this.logger.warn(
            `Хендлер ${metatype.name} не реализует getCommand()`,
          );
          continue;
        }

        const action = instance.getCommand() as Triggers<
          NarrowedContext<Context, Update>
        >;
        const aType = action.toString().split(':')[0];
        const aVal = action.toString().split(':')[1];
        switch (aType) {
          case 'command':
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            this.bot.command(aVal, (ctx) => instance.handle(ctx));
            this.logger.debug(
              `Зарегистрирован хендлер command: /${aVal.toString()}`,
            );
            break;
          case 'action':
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            this.bot.action(aVal, (ctx) => instance.handle(ctx));
            this.logger.debug(
              `Зарегистрирован хендлер action: @${aVal.toString()}`,
            );
            break;
        }
      }
    }
  }

  private findAllScenes(): (
    | Scenes.BaseScene<MyContext>
    | Scenes.WizardScene<MyContext>
  )[] {
    const providers = this.discoveryService.getProviders();
    const scenes: any[] = [];

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) continue;

      const isScene = this.reflector.get(TELEGRAM_SCENE_METADATA, metatype);
      if (isScene && typeof instance.getScene === 'function') {
        scenes.push(instance.getScene());
        this.logger.debug(`Загружена сцена: ${instance.constructor.name}`);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return scenes;
  }

  async onModuleInit() {
    // 1. Настройка Redis Session
    const sessionClient = new Proxy(this.redisClient, {
      get(target, prop) {
        if (prop === 'connect') return () => Promise.resolve();
        const value = target[prop];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });

    const store = Redis<MySessionData>({ client: sessionClient });
    this.bot.use(session({ store }));

    // 2. Инициализация Сцен
    const scenes = this.findAllScenes();
    const stage = new Scenes.Stage<MyContext>(scenes);
    this.bot.use(stage.middleware());

    // 3. Глобальный Гвардиан (Регистрация)
    this.setupGuard();

    // 4. Регистрация динамических хендлеров
    this.registerHandlers();

    // 5. Запуск
    this.bot.launch().catch((err) => this.logger.error('Ошибка запуска:', err));

    const botInfo = await this.bot.telegram.getMe();
    this.logger.debug(
      `Бот '${botInfo.first_name}' (@${botInfo.username}) успешно запущен`,
    );
  }

  private setupGuard() {
    this.bot.use((ctx, next) => {
      const userId = ctx.from?.id;
      const isAdmin =
        userId && String(userId) === String(this.config.telegram.botAdminId);

      if (isAdmin) return next();

      ctx.session ??= { status: 'registration' };
      if (!ctx.session.status) ctx.session.status = 'registration';

      if (ctx.session.status === 'registration') {
        if (
          ctx.message &&
          'text' in ctx.message &&
          ctx.message.text === '/start'
        ) {
          return next();
        }
        if (ctx.scene.current?.id === 'REGISTRATION_SCENE_ID') {
          return next();
        }
        return ctx.scene.enter('REGISTRATION_SCENE_ID');
      }

      return next();
    });
  }

  onModuleDestroy() {
    this.bot.stop('SIGINT');
  }

  getBot(): Telegraf<Context> {
    return this.bot;
  }
}
