import {  Types } from 'mongoose';
import { User } from "src/schemas/user.schema";

export type UserResponseType = Omit<User, 'password'> & { id: Types.ObjectId };