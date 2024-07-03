import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  //microservice will subscribe to nats, will not listen to any port
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      //configuring nats
      transport: Transport.NATS,
      options: {
        servers: ["nats://nats"],
      },
    },
  );
  console.log(`CRYPTO-MARKET-MICROSERVICE up and running`);
  await app.listen();
}

bootstrap();
