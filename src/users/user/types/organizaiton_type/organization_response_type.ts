import { Types } from 'mongoose';
import { User } from "src/schemas/user.schema";

export type OrganizationResponseType = Omit<User, 'password'> & {
  id: Types.ObjectId,
};
