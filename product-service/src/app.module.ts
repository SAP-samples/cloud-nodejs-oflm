
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/product.module';
import { ProductService } from './products/product.service';
import { StockService } from './products/stock.service';
import { StockModule } from './products/stock.module';
@Module({
  imports: [
    ProductModule, StockModule],
  controllers: [AppController],
  providers: [AppService, ProductService, StockService],
})
export class AppModule { }
