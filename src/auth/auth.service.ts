import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/auth.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './schema/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { executionAsyncResource } from 'async_hooks';
import { LoginDto } from './schema/dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService:JwtService) { }
    
    async registerUser(dto: RegisterUserDto): Promise<User>
    {
        console.log(dto);
        try {

            if (!dto)
            {
                throw new BadRequestException("Dto is empty");
            }
            const { username, password } = dto;
            console.log(username, password);

            const existingUser = await this.userModel.findOne({ username });

            if (existingUser)
            {
                throw new BadRequestException("user with this username already exists");
            }

            const salt = await bcrypt.genSalt();

            const hashPassword = await bcrypt.hash(password, salt);
            
            const newUser =new this.userModel({
                username,
                password: hashPassword
            });

            return await newUser.save();
        } catch (error) {
            console.log(error);
               throw new InternalServerErrorException("User registration failed");
        }
    }


    async login(dto: LoginDto)
    {
        try {
            const { username, password } = dto;
            const user = await this.userModel.findOne({ username });

            if (!user)
            {
                throw new BadRequestException("User not found");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid)
            {
                throw new BadRequestException("Password is incorrect please enter correct password");
            }

            const payload = {
                sub: user._id,
                username: user.username,
                message:"User logged in successfully"
            }

            /// write logic to generate token here......
            const access_token =await this.jwtService.signAsync(payload);

            return {
                access_token,
                message: 'User logged in successfully',
            };

        } catch (error) {
            throw new InternalServerErrorException("User login failed");
        }

    }


    


}
