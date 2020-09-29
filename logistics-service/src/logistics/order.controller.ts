import { Controller, Post, Body, Get, Req, ForbiddenException } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import { FreightOrder } from '../model/quotemodel.dto';
@Controller('order')
export class OrderController {
   constructor(private readonly orderService: OrderService) { }
   @Post()
   /**
    * API annotations are used for swagger implementation
    * API Tags help the endpoints in their grouping
    */
   @ApiBearerAuth()
   @ApiTags('Logistics Service')
   @ApiOperation({ summary: 'Create freight order' })
   /**
    * To create a new freight order
    *  @Req {object} gets the request details
    *  @Body is having Implementation of freightOrder class which specifies what are all the required payloads
   */
   async createFreightOrder(@Req() req: any, @Body() freightOder: FreightOrder) {
      const isAuthorized = req.authInfo.checkLocalScope('Supplier');
      if (isAuthorized) {
         const hanaClient = req.db;
         return await this.orderService.createFreightOrder(freightOder,req.user.id, hanaClient).then(result=>{
            return result;
         }).catch(err=>{
            throw err;
         });
      } else {
         throw new ForbiddenException();
      }
   }

   /**
    * 
    * @param req  gets request object containing authorization information
    * this method returns in getting all the freight orders created
    */
   @Get()
   @ApiBearerAuth()
   @ApiTags('Logistics Service')
   @ApiOperation({ summary: 'Get all Order' })
   async getFreightOrder(@Req() req: any) {
      const isAuthorized = req.authInfo.checkLocalScope('Supplier');
      if (isAuthorized) {
         const hanaClient = req.db;
         return await this.orderService.getOrders(hanaClient);
      } else {
         throw new ForbiddenException();
      }
   }
}
