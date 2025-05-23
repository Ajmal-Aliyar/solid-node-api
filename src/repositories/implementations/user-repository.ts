import { IUser, UserModel } from "@/models";
import { BaseRepository } from "../base/base-repository";
import { IUserRepository } from "../interface/i-user-repository";
import { injectable } from "inversify";
import { CreateUserDto } from "@/dtos/auth-dtos";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findUserById(id: string): Promise<IUser | null> {
      return await this.model.findById(id)
  }

  async create(data: CreateUserDto): Promise<IUser> {
    return await this.model.create(data)
  }
  
}
