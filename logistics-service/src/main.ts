import { NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getServices, cfServiceCredentials } from '@sap/xsenv';

/**
 * Security middleware
 */
const xsuaa = getServices({ xsuaa: { tag: 'xsuaa' } }).xsuaa;
import * as passport from 'passport';
import { JWTStrategy } from '@sap/xssec';
passport.use(new JWTStrategy(xsuaa));

/**
 * HANA DB configuration 
 */
import * as hana from '@sap/hdbext';
const hanacreds = cfServiceCredentials({ tag: 'hana' });


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Swagger Defination
   */
  const options = new DocumentBuilder()
    .setTitle('Logistics Service')
    .setDescription('APIs for logistics service')
    .setVersion('1.0').addBearerAuth().addTag('Logistics Service')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  //security 
  app.use(passport.initialize());
  app.use(passport.authenticate('JWT', { session: false }));
  //HANA middleware
  app.use(hana.middleware(hanacreds));
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
