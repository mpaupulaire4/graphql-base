import { GraphModule } from "vesper";
import { UserController } from "./User.controller";
import { UserResolver } from "./User.resoler";
import { User } from "./User.entity";

export class UserModule implements GraphModule {
  controllers = [
    UserController
  ];

  resolvers = [
    UserResolver
  ];

  entities = [
    User
  ]
}