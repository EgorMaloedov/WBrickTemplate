import { Scenes } from 'telegraf';
import { MyContext } from './context.interface';

export interface IBotScene {
  // Метод должен возвращать сконфигурированную сцену
  getScene(): Scenes.BaseScene<MyContext> | Scenes.WizardScene<MyContext>;
}
