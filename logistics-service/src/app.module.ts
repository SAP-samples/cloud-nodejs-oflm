
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuoteModule } from './logistics/quote.module';
import { QuoteService } from './logistics/quote.service';
import {OrderModule} from './logistics/order.module';
import {OrderService} from './logistics/order.service';
@Module({
      imports: [
            QuoteModule, HttpModule, OrderModule],
      controllers: [AppController],
      providers: [
            QuoteService, AppService, OrderService],
})
export class AppModule { }
