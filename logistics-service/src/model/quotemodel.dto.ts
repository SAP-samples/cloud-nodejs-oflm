import { IsNotEmpty, IsString, IsNumber, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Class implementation for freight order 
 * class validators are used to validate the coming data and datatype using nest.js pipes
 * 
 */
export class FreightOrder {
    //Swagger annotation starts here
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Contact Person Name'})
    //End of swagger defincation
    contactPerson: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Address' })
    address: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    @ApiProperty({ description: 'Phone Number', maxLength: 10 })
    phone: string;

    
    @IsNotEmpty()
    @IsString()
    @MaxLength(2)
    @ApiProperty({ description: 'Country Code', maxLength: 2 })
    countryCode: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({ description: 'Email' })
    email: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Total Distance Measured' })
    totalDistanceMeasured: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'productName'})
    productName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Product ID'})
    productId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Quantity'})
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Gross weight' })
    grossWeight: number;

    @IsNotEmpty()
    @IsNumber()
    @MaxLength(5)
    @ApiProperty({ description: 'Transportation Means Type Code', maxLength: 5  })
    transportationMeansType: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(4)
    @ApiProperty({ description: 'Lifecycle means', maxLength: 4 })
    lifecyclestatus: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(8)
    @ApiProperty({ description: 'Pickup Date', maxLength: 8 })
    pickupdate: string;

    
    @IsNotEmpty()
    @IsString()
    @MaxLength(8)
    @ApiProperty({ description: 'Delivery Date', maxLength: 8 })
    deliverydate: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Transportation Charges' })
    transportationCharges: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(3)
    @ApiProperty({ description: 'Currency Code', maxLength: 3 })
    currencycode: string;
}