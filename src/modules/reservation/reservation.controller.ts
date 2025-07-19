import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { Pagination } from "nestjs-typeorm-paginate";
import { ReservationDto } from "./dto/reservation.dto";
import { Reservation } from "./dto/reservation.entity";
import { ReservationService } from "./reservation.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { USER_ROLES } from "src/common/constants/app.utils";

@Controller("reservations")
export class ReservationController {
  constructor(private reservationService: ReservationService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query): Promise<Pagination<Reservation> | Reservation[]> {
    const role = req?.user?.roles[0];

    return this.reservationService.findAll(role === USER_ROLES.CUSTOMER ? { ...query, user_id: req.user.id } : query, { page: query.page, limit: query.limit });
  }

  @Get('/users')
  async findAllReservedUsers(@Query() query): Promise<Pagination<Reservation> | Reservation[]> {
    return this.reservationService.findReservationsByDateRangeAndSpaceId(query, { page: query.page, limit: query.limit });
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Get("performance")
  async getPerformance(): Promise<any> {
    const year = new Date().getFullYear();

    return this.reservationService.getTotalReservationsPerMonth(10, year)
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Get("performance-change")
  async getPerformanceDiff(@Query() query): Promise<any> {
    return this.reservationService.getReservationDifference(query)
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Get("performance-change-table")
  async getPerformanceDiffPaginate(@Query() query): Promise<any> {
    return this.reservationService.getReservationDifferencePaginate(query)
  }

  @UseGuards(JwtAuthGuard)
  @Roles(USER_ROLES.ADMIN)
  @Get("year-changes")
  async getYearChanges(): Promise<any> {
    const year = new Date().getFullYear();

    return this.reservationService.getYearChanges(year);
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Reservation> {
    return this.reservationService.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/space/:space_id')
  async getReservationBySpaceId(@Param('space_id') space_id: number): Promise<Reservation[]> {
    return this.reservationService.getReservationBySpaceId({ space_id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() reservationDto: ReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.create({ ...reservationDto, user_id: reservationDto?.user_id || req.user.id, reserved_by: req.user.id }, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() reservation: Reservation,
    @Request() req,
  ): Promise<Reservation | null> {
    return this.reservationService.update(id, reservation, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: number): Promise<{ [key: string]: string }> {
    return this.reservationService.remove(id);
  }
}
