import { UserRepository } from "@/repositories/implementations/user-repository";
import { IUserRepository } from "@/repositories/interface/i-user-repository";
import TYPES from "../types";
import { Container } from "inversify";

export const bindUserModule = async (container: Container) => {
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
}