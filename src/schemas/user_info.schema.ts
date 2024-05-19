import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { USER_GENDERS } from 'src/users/user/utils/user_genders_enum';

export class UserInfo {
    @Prop()
    phone?: number;
    @Prop({ enum: [USER_GENDERS.FEMALE, USER_GENDERS.MALE, USER_GENDERS.OTHER], })
    gender?: String;
    @Prop()
    dateOfBirth?: Date;
    @Prop()
    image?: String;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);