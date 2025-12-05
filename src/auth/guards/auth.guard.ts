import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) { }
    

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            return false;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload;
        } catch (error) {
            return false;
        }
        return true;
    }
}