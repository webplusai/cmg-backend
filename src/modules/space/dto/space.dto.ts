import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class SpaceDto {
  @ApiProperty({
    description: "Name of the space",
    example: "My space",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Location of the space",
    example: "UK",
  })
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: "Square meter of the space",
    example: "10",
  })
  @IsNotEmpty()
  @IsNumber()
  square_meters: number;

  @ApiProperty({
    description: "Price of the space",
    example: "10",
  })
  @IsNotEmpty()
  @IsNumber()
  price: string;

  @ApiProperty({
    description: "Currency of the price of the space",
    example: "GBP",
  })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: "Latitude of the space",
    example: "0.0",
  })
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({
    description: "Longitude of the space",
    example: "0.0",
  })
  @IsNotEmpty()
  longitude: string;

  @ApiProperty({
    description: "Image of the space",
    example: ".jpg",
  })
  images: any;
}
