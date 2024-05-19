import {  Types } from 'mongoose';
import { User } from "src/schemas/user.schema";

export type UserAuthResponseType = Omit<User, 'password'> & { token: string } & { id: Types.ObjectId };