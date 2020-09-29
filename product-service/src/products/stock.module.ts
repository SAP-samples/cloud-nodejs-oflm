import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        StockController],
    providers: [
        StockService],
})
export class StockModule { }
