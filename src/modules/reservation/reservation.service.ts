import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { STATUS, USER_ROLES, VALIDATION_ERROR_MESSAGES } from "../../common/constants/app.utils";
import { RecordNotFoundException } from "../../common/exceptions/systemErrors.exceptions";
import { QueryConfig, QueryParams } from "../../common/type.definitions";
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { Space } from "../space/dto/space.entity";
import { User } from "../user/dto/user.entity";
import { PerformanceChangeDto, PerformanceDto, PerformanceMonthDto, ReservationDto } from "./dto/reservation.dto";
import { Reservation } from "./dto/reservation.entity";

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) { }

  async findAll(
    q?: {
      user_id: string;
      space_id?: number;
      status?: string;
      square_meters?: number;
      start_month?: number;
      start_year?: number;
      end_month?: number;
      end_year?: number;
      sortOption?: string;
      sortOrder?: "ASC" | "DESC" | undefined;
    },
    options: IPaginationOptions = {
      page: 1,
      limit: 10,
    }
  ): Promise<Pagination<Reservation> | Reservation[]> {
    const queryBuilder = this.reservationRepository.createQueryBuilder('r');

    queryBuilder
      .leftJoinAndMapOne('r.space_id', Space, 's', 's.id = r.space_id')
      .leftJoinAndMapOne('r.user_id', User, 'u', 'u.id = r.user_id')
      .addSelect([
        `CONCAT(u.first_name, ' ', u.last_name) AS username`,
        `DATEDIFF(r.end_date, r.start_date) AS number_of_days`,
      ])

    if (q?.user_id) {
      queryBuilder.andWhere('r.user_id = :userId', { userId: q.user_id });
    }

    if (q?.space_id) {
      queryBuilder.andWhere('r.space_id = :spaceId', { spaceId: q.space_id });
    }

    if (q?.status) {
      queryBuilder.andWhere('r.status = :status', { status: q.status });
    }

    if (q?.start_month && q?.start_year) {
      queryBuilder.andWhere('(MONTH(r.start_date) = :startMonth OR MONTH(r.start_date) = :prevMonth) AND YEAR(r.start_date) >= :startYear', {
        startMonth: q.start_month,
        startYear: q.start_year,
        prevMonth: q.start_month === 1 ? 12 : q.start_month - 1
      });
    }

    if (q?.end_month && q?.end_year) {
      queryBuilder.andWhere('MONTH(r.end_date) <= :endMonth AND YEAR(r.end_date) <= :endYear', {
        endMonth: q.end_month,
        endYear: q.end_year,
      });
    }

    if (q?.start_month) {
      queryBuilder.andWhere(`(MONTH(r.start_date) = :startMonth OR (MONTH(r.start_date) = :prevMonth) AND MONTH(r.end_date) = :startMonth)`, {
        startMonth: q.start_month,
        prevMonth: q.start_month === 1 ? 12 : q.start_month - 1
      });
    }

    if (q?.end_month) {
      queryBuilder.andWhere('MONTH(r.end_date) = :endMonth', {
        endMonth: q.end_month
      });
    }

    if (q?.sortOption && q?.sortOrder) {
      let orderParam = q.sortOption;

      if (q.sortOption === 'date_range') {
        orderParam = 'DATEDIFF(r.end_date, r.start_date)';
      }
      queryBuilder.orderBy(orderParam, q.sortOrder);
    }

    return paginate<Reservation>(queryBuilder, options);
  }

  async findReservationsByDateRangeAndSpaceId(
    q?: {
      user_id: string;
      space_id?: number;
      start_month?: number;
      start_year?: number;
      start_day: number;
    },
    options: IPaginationOptions = {
      page: 1,
      limit: 10,
    }
  ): Promise<Reservation[]> {
    const conditions: string[] = [];

    let query = `
      SELECT 
        r.*,
        s.name,
        CONCAT(u.first_name, ' ', u.last_name) AS name
      FROM reservations r
      LEFT JOIN spaces s ON r.space_id = s.id
      LEFT JOIN users u ON r.user_id = u.id
    `;

    if (q?.space_id) {
      conditions.push(`(
        s.id = ${q?.space_id}
      )`)
    }

    if (q?.start_month && q?.start_year) {
      conditions.push(`
        (
          '${q?.start_year}-${q?.start_month}-${q?.start_day}' BETWEEN r.start_date AND r.end_date
        ) OR
        (
          (MONTH(r.start_date) = ${q?.start_month} AND YEAR(r.start_date) = ${q?.start_year} AND DAY(r.start_date) = ${q?.start_day})
        )
      `);
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      query += ` ${whereClause}`;
    }

    return this.reservationRepository.query(query);
  }

  async getReservationBySpaceId(
    q?: QueryParams
  ): Promise<Reservation[]> {

    let query = `
      SELECT 
        r.*, 
        s.name,
        r.start_date AS reservation_date,
        DATEDIFF(r.end_date, r.start_date) AS number_of_days,
        s.images,
        CONCAT(u.last_name, ' ', u.first_name) as username
      FROM reservations r
      LEFT JOIN spaces s ON r.space_id = s.id
      LEFT JOIN users u ON r.user_id = u.id
    `;

    const conditions: string[] = [];

    if (q?.space_id) {
      conditions.push(`r.space_id = ${q?.space_id}`);
    }

    if (q?.status) {
      conditions.push(`r.status = '${q?.status}'`);
    }

    if (q?.start_month && q?.start_year && q?.end_month && q?.end_year) {
      conditions.push(`
        (
          (MONTH(r.start_date) >= ${q?.start_month} AND YEAR(r.start_date) >= ${q?.start_year})
        )`);

      conditions.push(`(
          (MONTH(r.end_date) <= ${q?.end_month} AND YEAR(r.end_date) <= ${q?.end_year})
        )`)
    } else {
      if (q?.start_month && q?.start_year) {
        conditions.push(`
        (
          (MONTH(r.start_date) >= ${q?.start_month} AND YEAR(r.start_date) >= ${q?.start_year})
        )`);
      }

      if (q?.end_month && q?.end_year) {
        conditions.push(`
        (
          (MONTH(r.end_date) <= ${q?.end_month} AND YEAR(r.end_date) <= ${q?.end_year})
        )`);
      }
    }

    if (conditions.length > 0) {
      const whereClause = ` WHERE ${conditions.join(' AND ')}`;
      query += ` ${whereClause}`;
    }

    if (q?.sortOption && q?.sortOrder) {
      let orderParam = ''
      if (q?.sortOption === 'date_range') {
        orderParam = 'DATEDIFF(r.end_date, r.start_date)';
      }

      const orderByClause = `ORDER BY ${orderParam || q?.sortOption} ${q?.sortOrder}`;
      query += ` ${orderByClause}`;
    }

    const results = await this.reservationRepository.query(query);

    return results;
  }

  async findOne(
    query?: Pick<QueryConfig, "where"> & {
      select?: (keyof Reservation)[];
    },
  ): Promise<Reservation> {
    const data = await this.reservationRepository.findOne({
      where: query?.where,
      select: query?.select,
    });

    if (!data) {
      throw new RecordNotFoundException(
        VALIDATION_ERROR_MESSAGES.RECORD_NOT_FOUND,
      );
    }

    return data;
  }

  async find(
    query?: Pick<QueryConfig, "where"> & {
      select?: (keyof Reservation)[];
    },
  ): Promise<Reservation | null> {
    const data = await this.reservationRepository.findOne({
      where: query?.where,
      select: query?.select,
    });

    return data;
  }

  async canPost(payload: ReservationDto, user: any) {
    const start_date = moment(payload.start_date);
    const end_date = moment(payload.end_date);

    // If user already paid 50% he can only pay 100% next
    const userReservation = await this.find({ where: { 
      status: STATUS.PAID_50PERCENT,
      start_date: LessThanOrEqual(end_date.toDate()),
      end_date: MoreThanOrEqual(start_date.toDate()),
      space_id: payload.space_id,
      user_id: payload.user_id,
    }})    

    if (userReservation && payload.status === STATUS.PAID_50PERCENT) {
      return false;
    }

    if (userReservation && payload.status === STATUS.PAID_100PERCENT) {
      return true;
    }

    // If space booked by another user (already paid 50% or 100%) do not permit
    const otherReservation = await this.find({ where: { 
      status: In([STATUS.PAID_50PERCENT, STATUS.PAID_100PERCENT]),
      start_date: LessThanOrEqual(end_date.toDate()),
      end_date: MoreThanOrEqual(start_date.toDate()),
      space_id: payload.space_id,
    }})

    if (otherReservation && (payload.user_id !== otherReservation.user_id)) {
      return false;
    }

    return true;
  }

  async create(reservation: ReservationDto, user: any): Promise<Reservation> {
    if (!await this.canPost(reservation, user)) {
      throw new BadRequestException("Space is currently unavailable")
    }

    const newRecord = this.reservationRepository.create(reservation);

    return await newRecord.save();
  }

  async canUpdate(id: number, payload: Reservation, user: any) {
    const reservation = await this.findOne({ where: { id } })

    if (reservation.status === STATUS.RESERVED) return true;
    if (((reservation.user_id === String(user.id)) && [STATUS.RESERVED, STATUS.PAID_50PERCENT].includes(reservation.status as STATUS)) || user.roles.includes(USER_ROLES.ADMIN)) return true;

    return false;
  }

  async update(
    id: number,
    reservation: Reservation,
    user: any
  ): Promise<Reservation | null> {
    if (!await this.canUpdate(id, reservation, user)) {
      throw new BadRequestException("Reservation cannot be updated by this user")
    }

    await this.reservationRepository.update(id, reservation);

    return this.reservationRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ [key: string]: string }> {
    await this.reservationRepository.delete(id);

    return {
      message: "Reservation deleted successfully",
    };
  }

  async getTotalReservationsPerMonth(month, year): Promise<PerformanceDto[]> {
    let results: PerformanceDto[] = [];

    const q = await this.reservationRepository.query(`
      SELECT
        all_spaces.space_id,
        all_spaces.space_name,
        IFNULL(reserved_days, 0) as reserved_days,
        IFNULL(total_days, 0) as total_days,
        IFNULL(performance, 0) as performance
      FROM (
          SELECT DISTINCT id AS space_id, name as space_name FROM spaces
      ) AS all_spaces
      LEFT JOIN (
        SELECT
          s.id as space_id,
          s.name as space_name,
          SUM(
              CASE
                  WHEN MONTH(r.start_date) = MONTH(r.end_date) THEN DATEDIFF(r.end_date, r.start_date)
                  ELSE DATEDIFF(LAST_DAY(r.start_date), r.start_date)
              END
          ) as reserved_days,
          DAYOFMONTH(LAST_DAY(r.start_date)) as total_days,
          CONVERT(
              SUM(
                  CASE
                      WHEN MONTH(r.start_date) = MONTH(r.end_date) THEN DATEDIFF(r.end_date, r.start_date)
                      ELSE DATEDIFF(LAST_DAY(r.start_date), r.start_date)
                  END
              ), UNSIGNED
          ) / DAYOFMONTH(LAST_DAY(r.start_date)) * 100 as performance
        FROM reservations r
        LEFT JOIN spaces s ON r.space_id = s.id
        WHERE MONTH(r.start_date) = '${month}'
        AND YEAR(r.start_date) = ${year}
        GROUP BY r.space_id
      ) AS data ON all_spaces.space_id = data.space_id;
    `)

    results = q.sort((a, b) => (a.space_id - b.space_id))

    return results
  }

  async getReservationDifference({ month }): Promise<PerformanceChangeDto> {
    const results: PerformanceMonthDto[] = [];
    const year = new Date().getFullYear();
    const reservationA = await this.getTotalReservationsPerMonth(month, year);
    const reservationB = await this.getTotalReservationsPerMonth(month > 1 ? month - 1 : 1, year);

    for (let i = 0; i < reservationA.length; i++) {
      let reservation: PerformanceMonthDto = {}
      const diff = Number(Math.ceil(reservationA[i]?.['reserved_days'] || 0) - Number(reservationB[i]?.['reserved_days'] || 0))

      reservation = {
        currentMonth: reservationA[i],
        previousMonth: reservationB[i],
        change: diff * 100,
        space: reservationA[i]['space_name'],
        performance: (Number(reservationA[i]['performance'])).toFixed(2) || "0"
      }

      results.push(reservation)
    }

    const totalPerformances = results.reduce((accum, result) => (accum + Number(result?.performance || 0)), 0);
    const totalAverages = results.reduce((accum, change) => (accum + Number(change?.change || 0)), 0);

    return {
      data: results,
      averagePerformance: results.length == 0 ? '0' : (totalPerformances / results.length).toFixed(2),
      averageChanges: results.length == 0 ? '0' : (totalAverages / results.length).toFixed(2)
    };
  }

  async getReservationDifferencePaginate({ month, page = 1, itemsPerPage = 10 }): Promise<any> {
    const results: any = [];
    const year = new Date().getFullYear();
    const reservationA = await this.getTotalReservationsPerMonth(month, year);
    const reservationB = await this.getTotalReservationsPerMonth(month > 1 ? month - 1 : 1, year);

    // Calculate the starting index and ending index for pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Extract a subset of the results based on pagination parameters
    const paginatedResults = reservationA.slice(startIndex, endIndex);

    for (let i = 0; i < paginatedResults.length; i++) {
      let reservation = {};
      const diff = Number(
        Math.ceil(paginatedResults[i]?.['reserved_days'] || 0) - Number(reservationB[i]?.['reserved_days'] || 0)
      );
      reservation = {
        currentMonth: paginatedResults[i],
        previousMonth: reservationB[i],
        change: diff * 100,
        space: paginatedResults[i]['space_name'],
        performance: (Number(paginatedResults[i]['performance'])).toFixed(2),
      };

      results.push(reservation);
    }

    // Calculate the total number of pages
    const totalPages = Math.ceil(reservationA.length / itemsPerPage);

    return {
      data: results,
      meta: {
        totalItems: reservationA.length,
        itemCount: results.length,
        itemsPerPage: itemsPerPage,
        totalPages: totalPages,
        currentPage: page,
      },
    };
  }

  async getYearChanges(year: number): Promise<any> {
    let performances: any = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 1; i <= 12; i++) {
      const performance = await this.getTotalReservationsPerMonth(i, year);
      let averagePerformance = 0

      if (performance.length > 0) {
        averagePerformance = performance.reduce((accum, curr) => accum + Number(curr.performance), 0) / performance.length;
      }

      performances = [
        ...performances,
        {
          month: months[i - 1],
          performance: (averagePerformance).toFixed(2)
        }
      ]
    }

    return {
      performances
    };
  }
}
