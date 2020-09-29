import { Injectable } from '@nestjs/common';
@Injectable()
export class ProductService {

    /**
     * Returns list of all the products
     */
    async getAllProducts(hanaClient : any): Promise<any> {
        const query = `SELECT * FROM "Products.product"`;
        return await this.executeQuery(query, hanaClient).then(data => {
            return data;
        }).catch(err => {
            throw (err);
        });
    }

    /**
     * 
     * @param id Product Id
     * Returns product detials if product id is passed
     */
    async getProductDetails(id: any, hanaClient: any): Promise<any> {
        const query = `SELECT * FROM "Products.product" where PRODUCTID='${id.productId}'`;
        return await this.executeQuery(query, hanaClient).then(data => {
            return data;
        }).catch(err => {
            throw (err);
        });
    }

    /**
     * 
     * @param query HANA query
     */
    async executeQuery(query: string, hanaClient: any): Promise<any> {
        return new Promise((resolve, reject) => {
            hanaClient.exec(query, (err: unknown, result: Object) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}
