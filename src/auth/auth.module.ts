import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: "ysvvhdasvhvjhsavhvhvhasvhvasd",
      signOptions: { expiresIn: "1d" }
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
