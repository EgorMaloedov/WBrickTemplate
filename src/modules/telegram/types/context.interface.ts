import { Scenes } from 'telegraf';

// 1. Данные, которые лежат в ctx.session
export interface MySessionData extends Scenes.WizardSession {
  status?: 'registration' | 'active' | 'banned';
  lastMessageId?: number;
  // Поля сцен (__scenes) добавятся автоматически через WizardSession
}

// 2. Данные, которые лежат в ctx.scene.session (внутри конкретной сцены)
export interface MySceneSession extends Scenes.WizardSessionData {
  tempData?: string; // временные данные только для процесса регистрации
}

// 3. Финальный контекст
// Передаем наши интерфейсы в Generic: <Контекст, ДанныеСцены>
export interface MyContext extends Scenes.WizardContext<MySceneSession> {
  // Переопределяем session через пересечение, чтобы TS видел ваши поля
  session: MySessionData;
}
