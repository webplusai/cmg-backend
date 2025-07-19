import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { ReservationDto } from "./dto/reservation.dto";

@CustomRepository(ReservationDto)
export class SpaceReservationRepository extends Repository<ReservationDto> {}
