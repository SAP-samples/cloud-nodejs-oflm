import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class OrderService {
    async createFreightOrder(data: any, user:string, hanaClient : any): Promise<any> {
        const query = `INSERT INTO "FreightOrder.freightOrder" VALUES('${uuidv4()}','${user}',
            '${data.pickupdate}','${data.contactPerson}','${data.address}','${data.phone}','${data.countryCode}','${data.email}',
            '${data.totalDistanceMeasured}','${data.productName}',
            '${data.productId}','${data.quantity}','${data.grossWeight}','${data.transportationMeansType}','${data.lifecyclestatus}',
            '${data.pickupdate}','${data.deliverydate}','${data.transportationCharges}','${data.currencycode}')`;
        return await this.query(query,hanaClient).then(res => {
            return "Order Created";
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }
    async getOrders(hanaClient: any): Promise<any> {
        const query = `SELECT * FROM "FreightOrder.freightOrder"`;
        return await this.query(query,hanaClient).then(res => {
            return res;
        }).catch(err => {
            throw err;
        });
    }
    /**
     * 
     * @param query String HANA Query
     * returns the query execution result
     */
    async query(query: string, hanaClient: any) {
        return new Promise((resolve, reject) => {
            hanaClient.exec(query, (err: unknown, result: Object) => {
                if (err) reject(err);
                resolve(result);
            });
        })
    }
}