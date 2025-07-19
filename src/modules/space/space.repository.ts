import { CustomRepository } from "../../database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Space } from "./dto/space.entity";

@CustomRepository(Space)
export class SpaceRepository extends Repository<Space> {}
