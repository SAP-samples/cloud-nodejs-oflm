import { Controller, Get, Param, Req, UnauthorizedException} from '@nestjs/common';
import {ProductService} from './product.service';
import {ApiBearerAuth, ApiTags,ApiOperation, ApiParam } from '@nestjs/swagger';
@Controller('getProducts')
export class ProductController {
    constructor(private productService: ProductService){}
/**
 * Get List of all the products
 */
    @Get()
    @ApiBearerAuth()
    @ApiTags('Product Service')
    @ApiOperation({ summary: 'Get list of all Products' })
     getAllProducts(@Req() req: any): any{
        
        const isAuthorized = req.authInfo.checkLocalScope('Supplier');
        if(isAuthorized){
            const hanaClient = req.db;
            return this.productService.getAllProducts(hanaClient).then(data=>{
                return data;
            }).catch(error=>{
                throw(error);
            });
        }else{
            throw new UnauthorizedException();
        }
    }

    /**
     * 
     * @param id Product ID
     */
    @Get(':productId')
    @ApiTags('Product Service')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Returns product details based on product id'})
    @ApiParam({name:'productId',description:'Product Id' })
    getProduct(@Req()req: any,@Param() productId: any): any{
        const isAuthorized = req.authInfo.checkLocalScope('Supplier');
        if(isAuthorized){
            const hanaClient = req.db;
            return this.productService.getProductDetails(productId,hanaClient).then(data=>{
                return data;
            }).catch(error=>{
                throw(error);
            });
        }else{
            throw new UnauthorizedException();
        }
    }
 }
