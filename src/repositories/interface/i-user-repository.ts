import { CreateUserDto } from "@/dtos/auth-dtos";
import { IUser } from "@/models";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>
  create(data: CreateUserDto): Promise<IUser>
}
