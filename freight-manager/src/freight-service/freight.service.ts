import { HttpException, Injectable } from '@nestjs/common';
const quote = { "RAIL": 1000, "ROAD": 2000, "SHIP": 3000, "AIR": 4000 }
const standardShippingCost = 3;
const distanceCostPerKM = 0.1;
const weightPerKG = 2;
@Injectable()
export class AppService {
  getQuote(transportationMeans: string, weight: number, dimension: string, totalDistanceMeasured: number, quantity: number): number {
    if(dimension.split(",").length === 3){
      let dim = dimension.split(',');
      let dimestionFactor = 166;
      let dimensionWeight = Math.ceil(((parseFloat(dim[0]) * parseFloat(dim[1]) * parseFloat(dim[2])) * 39.37) / dimestionFactor); // convert meter into inches. 1 m = 39.37 inch 
      // formula : if pick the greatest among dimenstionWeight and weight  and multiply it with cost per weight in kg(ensure the weight is in celi format)
      let calculationWeight = dimensionWeight > Math.ceil(weight) ? dimensionWeight : Math.ceil(weight);
      let distanceCost = totalDistanceMeasured > 400 ? 0 : (totalDistanceMeasured - 400) * distanceCostPerKM;
      let transportationCharges = calculationWeight * weightPerKG + distanceCost + standardShippingCost + quote[transportationMeans] * quantity;
      return transportationCharges;
    }else{
      throw new HttpException('Invalid Dimension', 400);
    }
  
  }
}
