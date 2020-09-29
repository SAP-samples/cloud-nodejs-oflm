import { Controller, Get, Query, Put, Req, UnauthorizedException } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
@Controller('stock')
export class StockController {
    constructor(private stockService: StockService) { }
/**
 * 
 * @param req 
 * @param productId Product ID
 * @param quantity  Quantity
 */
    @Get()
    //Swagger defination starts here
    @ApiTags('Product Service')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets product id, quantity and checks for stock' })
    @ApiQuery({
        name: 'productId',
        description: 'Id of the product',
        type: String
    })
    @ApiQuery({
        name: 'quantity',
        description: 'Quantity to be shipped',
        type: Number
    })
    // end of swagger defination

    checkStock(@Req() req: any, @Query('productId') productId: string, @Query('quantity') quantity: number): any {
        const isAuthorized = req.authInfo.checkLocalScope('Supplier');
        if (isAuthorized) {
            const hanaClient = req.db;
            return this.stockService.checkStock(productId, quantity, hanaClient);
        } else {
            throw new UnauthorizedException();
        }
    }

    /**
     * Update stock section
     * @param productId product id 
     * @param quantity quantity
     */
    @Put()
    @ApiTags('Product Service')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gets product id, quantity and checks for stock' })
    @ApiQuery({
        name: 'productId',
        description: 'Id of the product',
        type: String
    })
    @ApiQuery({
        name: 'quantity',
        description: 'Quantity to be shipped',
        type: Number
    })
    updateStock(@Req() req: any, @Query('productId') productId: string, @Query('quantity') quantity: number): any {
        const isAuthorized = req.authInfo.checkLocalScope('Supplier');
        if (isAuthorized) {
            const hanaClient = req.db;
            return this.stockService.updateStock(productId, quantity, hanaClient);
        } else {
            throw new UnauthorizedException();
        }
    }
}
