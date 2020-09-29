import { NestFactory } from '@nestjs/core';
import { AppModule } from './freight-service/freight.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { getServices } from '@sap/xsenv';
const xsuaa = getServices({ xsuaa: { tag: 'xsuaa' } }).xsuaa;
import * as passport from 'passport';
import { JWTStrategy } from '@sap/xssec';
passport.use(new JWTStrategy(xsuaa));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger Initialization
  const options = new DocumentBuilder()
  .setTitle('Freight Manager')
  .setDescription('APIs for Freight Manager')
  .setVersion('1.0').addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);
  //security implementation 
  app.use(passport.initialize());
  app.use(passport.authenticate('JWT', { session: false }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
