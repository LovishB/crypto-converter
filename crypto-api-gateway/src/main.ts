import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs'); //setting template engine
  const PORT = process.env.PORT || 3000; //dynamic port allocation
  await app.listen(PORT, () =>
    console.log(`CRYPTO-API-GATEWAY running on PORT ${PORT}`),
  );
}
bootstrap();
