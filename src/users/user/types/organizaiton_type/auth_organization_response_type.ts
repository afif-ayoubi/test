import { Types } from 'mongoose';
import { User } from "src/schemas/user.schema";

export type OrganizationAuthResponseType = Omit<User, 'password'> & {
  id: Types.ObjectId,
} & { token: string };
