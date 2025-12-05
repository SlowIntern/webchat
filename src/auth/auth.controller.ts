import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './schema/dto/register.dto';
import { User } from './schema/auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    console.log(registerUserDto);
    return this.authService.registerUser(registerUserDto);
  }


  @Post('login')
  async login(@Body() loginDto: RegisterUserDto): Promise<object> {
    console.log(loginDto);
    return this.authService.login(loginDto);
  }
}
