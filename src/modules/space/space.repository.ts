import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Space } from "./dto/space.entity";

@CustomRepository(Space)
export class SpaceRepository extends Repository<Space> {}
