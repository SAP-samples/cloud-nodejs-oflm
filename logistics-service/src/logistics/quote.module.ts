import { QuoteController } from './quote.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {QuoteService} from './quote.service';
@Module({
    imports: [HttpModule],
    controllers: [
        QuoteController],
    providers: [QuoteService],
})
export class QuoteModule {}
