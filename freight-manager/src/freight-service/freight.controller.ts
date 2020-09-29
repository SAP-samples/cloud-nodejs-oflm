import { Controller, Get, Query, ParseIntPipe, Req, UnauthorizedException } from '@nestjs/common';
import { AppService } from './freight.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
/**
 * Swagger defination starts here
 */
  @Get()
  @ApiBearerAuth()
  @ApiTags('Freight Service')
  @ApiQuery({
    name: 'transportationmeans',
    description: 'Mode of transportation (AIR, ROAD, SHIP, RAIL)',
    type: String
  })
  @ApiQuery({
    name: 'quantity',
    description: 'Number of items to be shipped',
    type: Number
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
// end of swagger defination

/**
 * Gets query parameters required for calucation for freight order
 */
  getQuote(@Req() req: any,@Query('transportationmeans') transportationMeans: string, @Query('weight', ParseIntPipe) weight: number,
    @Query('dimension') dimension: string, @Query('totalDistanceMeasured', ParseIntPipe) totalDistanceMeasured: number, 
    @Query('quantity', ParseIntPipe) quantity: number): number {
    
    const isAuthorized = req.authInfo.checkLocalScope('Access');
    if(isAuthorized){
      let transportationCharges = this.appService.getQuote(transportationMeans, weight, dimension, totalDistanceMeasured, quantity);
      return transportationCharges;
    }else{
      throw new UnauthorizedException();
    }
  }
}