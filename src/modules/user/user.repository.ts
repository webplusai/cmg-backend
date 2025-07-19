import { Repository } from "typeorm";
import { User } from "./dto/user.entity";
import {
  AdminCreateUserRequestDto,
  UserRegisterRequestDto,
} from "./dto/user.dto";
import { ForbiddenException } from "../../common/exceptions/systemErrors.exceptions";
import { CustomRepository } from "../../database/typeorm-ex.decorator";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * This method registers a new user
   * @param data
   * @returns Promise<User>
   */
  async registerUser(
    data: UserRegisterRequestDto | AdminCreateUserRequestDto,
  ): Promise<User> {
    const user = await this.findOne({
      where: {
        email: data.email,
      },
    });
    if (user)
      throw new ForbiddenException("User already exists with this email");
    if (data.password !== data.confirm_password)
      throw new ForbiddenException("Passwords do not match");
    const newUser = this.create(data);
    return await newUser.save();
  }

  async deleteUser(id: number): Promise<void> {
    await this.delete(id);
    return;
  }
}
