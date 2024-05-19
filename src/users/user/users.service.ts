import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/schemas/user.schema";
import { UserAuthResponseType } from "./types/user_type/auth_user_response_type";
import { compare } from "bcrypt";
import { sign } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { UserResponseType } from "./types/user_type/user_response_type";
import { CreateUserDto } from "./dto/user_dto/create_user.dto";
import { LoginDto } from "./dto/user_dto/login.dto";
import { ModelConflictException, ModelNotFoundException, ModelUnprocessableEnitityException } from "src/core/error/exception";
import { ERROR_MESSAGES } from "src/core/constants/error_message";
import {  OrganizationDto } from "./dto/organization_dto/organization.dto";
import 'dotenv/config';
import { FollowDto } from "./dto/follow_dto/follow.dto";
import { USER_ROLES } from "./utils/user_roles_enum";
import { ChangePasswordDto } from "./dto/user_dto/change_password.dto";
import { hash,  } from 'bcrypt';


export type UserDocument = HydratedDocument<User>;


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    ) { }

 
    async createOrganization(organizationDto: OrganizationDto): Promise<UserDocument> {
        const existingOrganization = await this.userModel.findOne({ email: organizationDto.email });
        if (existingOrganization) {
            throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.EMAIL_ALREADY_TAKEN);
        }

        const newOrganization = new this.userModel({
            ...organizationDto,
            organizationDetail: {
                ...organizationDto.organizationDetail,
                volunteeringSection: organizationDto.organizationDetail, 
            }
        });

        return newOrganization.save();
    }

    async updateOrganization(id: string, organizationDto: any): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: organizationDto.email });

        console.log(existingUser._id.toString() );
        
        if (existingUser && existingUser._id.toString() !== id) {
            throw new ModelConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);;
        }
        const user = this.userModel.findByIdAndUpdate(id, organizationDto, { new: true });
        if (!user) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.USER_NOT_FOUND);
        return user;
    }


    async loginUser(loginDto: LoginDto): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email: loginDto.email }).select("+password");
     
        if (!user) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.USER_NOT_FOUND);
        const isPasswordCorrect = await compare(loginDto.password, user.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.INCORRECT_PASSWORD);
        return user;
    }


    async changePassword(changePasswordDto: ChangePasswordDto): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email: changePasswordDto.email }).select('+password');
        if (!user) {
          throw new ModelNotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
        }
    
        user.password = changePasswordDto.newPassword;
        await user.save();
    
        console.log(`New password for user ${user.email} is: ${changePasswordDto.newPassword}`);
    
        return user;
      }
    
    getUsers(): Promise<User[]> {
        return this.userModel.find();
    }
    async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
        const user = (await this.userModel.findOne({ email: createUserDto.email }));
        if (user) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.EMAIL_ALREADY_TAKEN);

        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }



    async updateUser(id: string, updateUserDto: any): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
        if (existingUser && existingUser._id.toString() !== id) {
            throw new ModelConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);;
        }
        const user = this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        if (!user) throw new ModelUnprocessableEnitityException(ERROR_MESSAGES.USER_NOT_FOUND);
        return user;
    }


    async followOrganization(userId: string, followDto: FollowDto): Promise<User> {
        const user = await this.userModel.findById(userId);
        const organization = await this.userModel.findById(followDto.organizationId);

        if (!user || !organization) {
            throw new ModelNotFoundException('User or Organization not found');
        }

        if (user.role !== USER_ROLES.USER || organization.role !== USER_ROLES.ORGANIZATION) {
            throw new ModelConflictException('Invalid roles for follow action');
        }

        if (!user.followers) {
            user.followers = [];
        }

        user.followers.push({ organizationId: followDto.organizationId });
        return user.save();
    }


    async unfollowOrganization(userId: string, followDto: FollowDto): Promise<User> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new ModelNotFoundException('User not found');
        }

        if (user.role !== USER_ROLES.USER) {
            throw new ModelConflictException('Only users can unfollow organizations');
        }

        user.followers = user.followers.filter(follower => follower.organizationId.toString() !== followDto.organizationId);
        return user.save();
    }


    async getOrganizationsByVolunteeringSectionName(id: string): Promise<UserDocument[]> {
        const hello= this.userModel.find({ 'organizationDetail.volunteeringSection._id': id });
        return hello;
    }
    

    buildUserResponse(user: UserDocument): UserResponseType {

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            id: user._id,
            userInfo: user.userInfo,
            organizationDetail: user.organizationDetail,
            notifications: user.notifications,
            followers: user.followers,
        };
    }

    buildAuthUserResponse(user: UserDocument): UserAuthResponseType {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: this.generateJwt(user),
            id: user._id,
            userInfo: user.userInfo,
            organizationDetail: user.organizationDetail,
            notifications: user.notifications,
            followers: user.followers,

        };
    }

  
    generateJwt(user: UserDocument): string {
        const userId = user._id;
        return sign({ userId: userId }, process.env.JWT_SECRET);
    }
    async findById(id: Types.ObjectId): Promise<UserDocument> {

        return this.userModel.findById(id);
    }
}
