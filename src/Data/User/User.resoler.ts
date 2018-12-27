import {Resolver, ResolverInterface } from "vesper";
import { User } from "./User.entity";

@Resolver(User)
export class UserResolver implements ResolverInterface<User> {

}