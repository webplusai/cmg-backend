import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { UserRoleRepository } from './user-role.repository';

@Module({
  controllers: [UserRoleController],
  imports: [TypeOrmExModule.forCustomRepository([UserRoleRepository])],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
