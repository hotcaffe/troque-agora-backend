import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Keycloak } from "src/Services/keycloak/keycloak";



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly keycloak: Keycloak) {}

    hasRoles(roles: string[], token: any): boolean {
        const userRoles = token?.resource_access?.["troque-agora-client"]?.roles as string[];
        if (!userRoles) return false
        return roles.every(role => userRoles.includes(role))
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const {access_token, refresh_token} = request.cookies;
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const introspected_access_token = await this.keycloak.introspectToken(access_token)
        if (introspected_access_token?.active) {
            request.introspected_access_token = introspected_access_token;
            if (roles) {
                if (this.hasRoles(roles, introspected_access_token)) {
                    return true
                } else {
                    response.action = 'REDIRECT_USER'
                    return false
                }
            } else {
                return true
            }
        } else {
            if (refresh_token) {
                const {access_token: new_access_token, refresh_token: new_refresh_token} = await this.keycloak.refreshUserSession(refresh_token);
                if (new_access_token && new_refresh_token) {
                    response.cookie('access_token', new_access_token, {
                    httpOnly: true
                    })
                    response.cookie('refresh_token', new_refresh_token, {
                    httpOnly: true
                    })
            
                    return true;
                } else {
                    response.action = 'REVOKE_SESSION'
                    return false
                }
            }
        }
        
        response.action = 'REVOKE_SESSION'
        return false
    }
}