import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { RoleRepository } from './role.repository';

@Module({
  controllers: [RolesController],
  imports: [TypeOrmExModule.forCustomRepository([RoleRepository])],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
