import { Injectable } from '@nestjs/common';
@Injectable()
export class StockService {
    /**
     * Checks stock. Return true is the requested quantity is greater or equal to the required stock
     * 
     * @param productId product id
     * @param quantity quantity to be shipped
     */
    async checkStock(productId: string, quantity: number, hanaClient: any): Promise<any> {
        let query = `SELECT "QUANTITY" FROM "Products.stock" where PRODUCTID='${productId}'`;
        return await this.executeQuery(query,hanaClient).then(stock => {
            if (stock[0].QUANTITY >= quantity){
                return true;
            }else {
                return false;
            }
        }).catch(err => {
            throw err;
        });
    }
/**
 * this method is used to update the quantity value
 * @param productId product id
 * @param quantity Quantity
 */
    async updateStock(productId: string, quantity: number, hanaClient: any): Promise<any> {
        let query = `Update "Products.stock" set QUANTITY=QUANTITY-${quantity} where PRODUCTID='${productId}'`;
        return await this.executeQuery(query,hanaClient).then(stock => {
          return 'Stock Updated';
        }).catch(err => {
            throw err;
        });
    }
    /**
     * Query Execution 
     * @param query SQL query 
     */
    async executeQuery(query: string, hanaClient: any): Promise < any > {
        return new Promise((resolve, reject) => {
            hanaClient.exec(query, (err: unknown, result: Object) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}
