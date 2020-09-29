import { Injectable } from '@nestjs/common';
import { ServiceCredentials } from '../providers/security-credentials.provider';
import { destination } from '../providers/destination.provider';
const axios = require('axios').default;
@Injectable()
export class QuoteService {
    processQuote(mode: string, quantity: number, weight: number, totalDistanceMeasured: number, dimension: string) {
        return new Promise((resolve, reject) => {
            this.getClientToken(ServiceCredentials[0]).then(token => {
                let header = { "Authorization": 'Bearer ' + token };
                this.getFreight(header, quantity, weight, totalDistanceMeasured, dimension, mode).then((data: any) => {
                    console.log("Request Came here");
                    resolve(data);
                }).catch(error => {
                    console.log("Error Getting Quote");
                    reject(error);
                });
            }).catch(error => {
                console.log("Error Handling token", error);
                reject(error);
            });
        });
    }
    /**
     *  Calls the frieght Manager service using this method
     * @param authHeader Bearet Token
     * @param quantity Quantity represents the weight
     */
    async getFreight(authHeader: any, quantity: number, weight: number, totalDistanceMeasured: number, dimension: string, mode: string) {
        return new Promise((resolve, reject) => {
            destination.then(destinationObject => {
                let url = destinationObject.url + `?transportationmeans=${mode}&weight=${weight}&totalDistanceMeasured=${totalDistanceMeasured}&quantity=${quantity}&dimension=${dimension}`;
                this.httpService(url, authHeader).then(data => {
                    console.log("in quote data part");
                    resolve(data.data);
                }).catch(error => {
                    console.log("in Quote error Part");
                    console.log(error.response.data);
                    reject(error.response.data);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * This method is used to generate client credentials
     * @param clientCredentials XSUAA credentials returned from credentials provider
     */
    async getClientToken(clientCredentials: any) {
        return new Promise((resolve, reject) => {
            const url = `${clientCredentials.url}/oauth/token`;
            axios.post(url, `grant_type=client_credentials&client_id=${clientCredentials.clientId}&client_secret=${clientCredentials.clientSecret}`).then((res: any) => {
                resolve(res.data.access_token);
            }).catch((error: any) => {
                console.log(error);
                reject(error);
            });
        });
    }
    /**
     * this calls product service to check the stock availablity status
     * @param authHeader Authentication Token
     * @param item Product ID to be shipped
     * @param quantity Number of items
     */
    async checkProductStock(authorization: any, mode: string, productId: string, quantity: number,
        weight: number, totalDistanceMeasured: number, dimension: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = process.env.product_service + `/stock?productId=${productId}&quantity=${quantity}`;
            let header = { "Authorization": authorization };
            this.httpService(url, header).then(data => {
                console.log(data.data);
                if (data.data === true) {
                    this.processQuote(mode, quantity, weight, totalDistanceMeasured, dimension).then(data => {
                        resolve(data);
                    }).catch(error => {
                        console.error("in check product Stock");
                        reject(error);
                    });
                } else {
                    reject(false)
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    async httpService(url: string, header: any): Promise<any> {
        try {
            const request = await axios.get(url, { headers: header });
            return request;
        } catch (error) {
            throw error;
        }
    }
}
