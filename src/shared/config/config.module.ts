import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { validationSchema } from './validation';
import { WBrickConfigService } from './config.service'; // имя файла/класса подправь, если отличается

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
  providers: [WBrickConfigService],
  exports: [WBrickConfigService],
})
export class WBrickConfigModule {}
