import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserAuthResponseType } from "./types/user_type/auth_user_response_type";
import { ExpressRequest } from "../middlewares/auth.middleware";
import { UserResponseType } from "./types/user_type/user_response_type";
import { CreateUserDto } from "./dto/user_dto/create_user.dto";
import { LoginDto } from "./dto/user_dto/login.dto";
import { UpdateUserDto } from "./dto/user_dto/update_user.dto";
import { USER_ROLES } from "./utils/user_roles_enum";
import { OrganizationDto } from "./dto/organization_dto/organization.dto";
import { OrganizationResponseType } from "./types/organizaiton_type/organization_response_type";
import { UpdateOrganizationDto } from "./dto/organization_dto/update_organization.dto";
import { FollowDto } from "./dto/follow_dto/follow.dto";
import { ChangePasswordDto } from "./dto/user_dto/change_password.dto";

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService,
     
    ) { }
    @Post('/create-organization')
    async createOrganization(@Body() organizationDto: OrganizationDto): Promise<UserAuthResponseType> {
        const user = await this.userService.createOrganization({ ...organizationDto, role: USER_ROLES.ORGANIZATION });
        return this.userService.buildAuthUserResponse(user);
    }
    @Patch('/update-organization')
    async updateOrganization(@Request() request: ExpressRequest, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<OrganizationResponseType> {
        console.log(updateOrganizationDto);
        const userId = request.user._id.toString();
        const updatedUser = await this.userService.updateOrganization(userId, updateOrganizationDto);
        return this.userService.buildUserResponse(updatedUser);
    }

    @Post('/create')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserAuthResponseType> {
        const user = await this.userService.createUser({ ...createUserDto, role: USER_ROLES.USER, });

        return this.userService.buildAuthUserResponse(user);
    }
    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<UserAuthResponseType> { 
        console.log(loginDto);
        const user = await this.userService.loginUser(loginDto);
        return this.userService.buildAuthUserResponse(user);
    }
    @Get('/all')
    getUsers() {
        return this.userService.getUsers();
    }

    @Get()
    async currentUser(@Request() request: ExpressRequest): Promise<UserResponseType> {
        return this.userService.buildUserResponse(request.user);

    }
    
    @Patch('/change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<UserResponseType> {
      const user = await this.userService.changePassword(changePasswordDto);
      return this.userService.buildUserResponse(user);
    }

    @Post(':id/follow')
    async followUser( @Param('id') userId: string, @Body() followDto: FollowDto) {
        return this.userService.followOrganization(userId, followDto);
    }

    @Post(':id/unfollow')
    async unfollowUser( @Param('id') userId: string, @Body() followDto: FollowDto) {
        return this.userService.unfollowOrganization(userId, followDto);
    }

    @Patch()
    async updateUser(@Request() request: ExpressRequest, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseType> {
        const userId = request.user._id.toString();
        const updatedUser = await this.userService.updateUser(userId, updateUserDto);
        return this.userService.buildUserResponse(updatedUser);


    }

    @Get('/organization/:volunteeringSectionId')
    async getOrganizationsByVolunteeringSectionId(@Param('id') id: string): Promise<UserResponseType[]> {
        const organizations = await this.userService.getOrganizationsByVolunteeringSectionName(id);
        return organizations.map(org => this.userService.buildUserResponse(org));
    }


}