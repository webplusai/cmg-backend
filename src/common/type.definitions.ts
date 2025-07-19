import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/modules/user/dto/user.entity";
import { FindOptionsWhere } from "typeorm";

export class PaginationResponse {
  @ApiProperty({
    type: Number,
    description: "Current page number",
  })
  page?: number;

  @ApiProperty({
    type: Number,
    description: "Number of records per page",
  })
  limit?: number;

  @ApiProperty({
    type: Number,
    description: "Total number of records",
  })
  total?: number;

  @ApiProperty({
    type: Number,
    description: "Total number of pages",
  })
  totalPages?: number;

  @ApiProperty({
    type: [Object],
    description: "Array of results",
  })
  results?: unknown[];
}

export class GetUsersResponseDto extends PaginationResponse {
  @ApiProperty({
    type: [User],
    description: "Array of users",
  })
  declare results?: User[];
}

export interface QueryConfig {
  where?: FindOptionsWhere<unknown>[] | FindOptionsWhere<unknown>;
  select?: unknown;
  page?: number;
  limit?: number;
  skip?: number;
  order?: unknown;
  restrictedFields?: string[];
}

export interface GetUserRecordsRequestDto extends QueryConfig {
  select?: (keyof User)[];
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginatedDto<TData> {
  items: TData[];
  meta: PaginationMeta;
}

export interface QueryParams {
  user_id?: string | number
  space_id?: number
  status?: string
  start_month?: string
  start_year?: string
  end_month?: string
  end_year?: string
  sortOption?: string
  sortOrder?: string
}