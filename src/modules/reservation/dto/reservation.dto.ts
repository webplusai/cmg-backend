import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReservationDto {
  @ApiProperty({
    description: "Space id",
    example: "1",
  })
  @IsNotEmpty()
  space_id: string;

  @ApiProperty({
    description: "User id",
    example: "1",
  })
  user_id: string;

  @ApiProperty({
    description: "Customer id",
    example: "1",
  })
  reserved_by: string;

  @ApiProperty({
    description: "Date the reservation starts",
  })
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    description: "Date the reservation ends",
  })
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({
    description: "Status of the reservation",
    example: "RESERVED",
  })
  @IsNotEmpty()
  status: string;
}

export interface PerformanceDto {
  space_id: number,
  space_name: string,
  reserved_days: number,
  total_days: number,
  performance: string
}

export interface ReservationDifferenceDto {
  data: [],
  averagePerformance: number,
  averageChanges: number
}

export interface PerformanceMonthDto {
  currentMonth?: PerformanceDto,
  previousMonth?: PerformanceDto,
  change?: number,
  space?: string,
  performance?: number | string
}

export interface PerformanceChangeDto {
  data: PerformanceMonthDto[],
  averagePerformance: string,
  averageChanges: string
}
