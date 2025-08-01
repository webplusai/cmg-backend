import { SetMetadata } from "@nestjs/common";

export const TYPEORM_EX_CUSTOM_REPOSITORY = "TYPEORM_EX_CUSTOM_REPOSITORY";

type EntityConstructor = new (...args: unknown[]) => unknown;

export function CustomRepository(entity: EntityConstructor): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
