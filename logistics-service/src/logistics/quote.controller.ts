import { Controller, Get, Query, Catch, HttpException, HttpStatus, Req, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
@Controller('getQuote')
@Catch()
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) { }
  /**
   * 
   * @param req authorization header
   * @param mode mode of transport
   * @param productId 
   * @param quantity 
   * @param totalDistanceMeasured 
   * @param weight 
   * @param dimension 
   * @Get annotation is used for swagger implementation
   */

  /**
   * Swagger defination goes here
   */ 
  @Get()
  @ApiBearerAuth()
  @ApiTags('Logistics Service')
  @ApiOperation({ summary: 'Get Quote from freight service using technical user authentication' })
  @ApiQuery({
    name: 'mode',
    description: 'Mode of transportation (Air, Water, Rail, Road)',
    type: String
  })
  @ApiQuery({
    name: 'quantity',
    description: 'Number of items to be shipped',
    type: Number
  })
  @ApiQuery({
    name: 'productId',
    description: 'Product ID',
    type: String
  })
  @ApiQuery({
    name: 'totalDistanceMeasured',
    description: 'Distance for delivery',
    type: String
  })
  @ApiQuery({
    name: 'weight',
    description: 'Product Weight',
    type: String
  })
  @ApiQuery({
    name: 'dimension',
    description: 'Product dimension(Height,length,width)',
    type: String
  })
  @ApiResponse({ status: 204, description: 'Out of stock' })
  @ApiResponse({ status: 200, description: 'Ok' })
// end of swagger defination

// Pipe methods are used for validation
  async getQuote(@Req() req: any, @Query('mode') mode: string, @Query('productId') productId: string, @Query('quantity', ParseIntPipe) quantity: number,
    @Query('totalDistanceMeasured',ParseIntPipe) totalDistanceMeasured: number, @Query('weight',ParseIntPipe) weight: number, @Query('dimension') dimension: string,
  ): Promise<any> {
    const authorization = req.headers.authorization;
    const isAuthorized = req.authInfo.checkLocalScope('Supplier');
    // checks for authorization before executing next block, if unauthorized, returns exception
    if(isAuthorized){
      return await this.quoteService.checkProductStock(authorization, mode.toUpperCase(), productId, quantity,
        weight, totalDistanceMeasured, dimension).then(data => {
          return { Cost: data };
        }).catch(error => {
          /**
           * if error is false, its a out of stock error
           */
          if (error === false) {
            throw new HttpException('Product Out Of Stock',HttpStatus.NO_CONTENT);
          }
          console.log(error);
          throw new HttpException({"status": 500,"error": "Unable to handle request"}, HttpStatus.INTERNAL_SERVER_ERROR);
        });
    }else{
        throw new UnauthorizedException();
    }
  }
}
