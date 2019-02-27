import { GraphModule } from 'vesper';
import { UserController } from './User.controller';
import { User } from './User.entity';
import { UserResolver } from './User.resoler';

export class UserModule implements GraphModule {
  public controllers = [
    UserController,
  ];

  public resolvers = [
    UserResolver,
  ];

  public entities = [
    User,
  ];
}
