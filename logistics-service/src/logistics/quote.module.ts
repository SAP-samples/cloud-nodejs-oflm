import { QuoteController } from './quote.controller';
import { Module, HttpModule } from '@nestjs/common';
import {QuoteService} from './quote.service';
@Module({
    imports: [HttpModule],
    controllers: [
        QuoteController],
    providers: [QuoteService],
})
export class QuoteModule {}
