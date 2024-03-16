import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Keycloak } from "src/Services/keycloak/keycloak";



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly keycloak: Keycloak) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {access_token, refresh_token} = request.cookies;

        const introspected_access_token = await this.keycloak.introspectToken(access_token)

        if (introspected_access_token?.active) {
            request.introspected_access_token = introspected_access_token;
            return true
        }
        
        return false
    }
}