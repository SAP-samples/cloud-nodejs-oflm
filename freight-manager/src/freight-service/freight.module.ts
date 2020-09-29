import { Module } from '@nestjs/common';
import { AppController } from './freight.controller';
import { AppService } from './freight.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
