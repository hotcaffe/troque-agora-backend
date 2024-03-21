import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {Cache} from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class Keycloak {
    constructor(private readonly httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    private keycloakURL = process.env.KEYCLOAK_URL;
    
    private async auth() {
        const cached_access_token = await this.cacheManager.get("client_access_token")
        if (!cached_access_token) {
            const form = {
                client_id: process.env.KEYCLOAK_CLIENT,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
                grant_type: "client_credentials"
            }
    
            const {access_token} = await lastValueFrom(this.httpService.post(this.keycloakURL + "/realms/troque-agora/protocol/openid-connect/token", 
                {...form}, 
                {
                    headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )).then(res => res.data)

            await this.cacheManager.set("client_access_token", access_token, 1800)

            return access_token
        } else {
            return cached_access_token
        }
    }

    async createUser(firstName: string, email: string, username: string, password: string) {
        const clientToken = await this.auth();
        await lastValueFrom(this.httpService.post(this.keycloakURL + "admin/realms/troque-agora/users", 
            {
                firstName,
                email,
                username,
                credentials: [{
                    type: "password",
                    value: password,
                    temporary: false
                }],
                enabled: true,
                requiredActions: []
            },
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                }
            }
        ))

    }

    async updateUserAttributes(username: string, attributes: {[K: string]: string[]}) {
        const clientToken = await this.auth();
        const {id} = await this.findUser(username);

        if (!id) throw new NotFoundException("Usuário não encontrado!")

        await lastValueFrom(this.httpService.put(this.keycloakURL + "admin/realms/troque-agora/users/" + id, 
            {
                attributes
            },
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                }
            }
        ))
    }

    async findUser(username: string) {
        const clientToken = await this.auth();
        return await lastValueFrom(this.httpService.get(this.keycloakURL + "admin/realms/troque-agora/users?" + `username=${username}&exact=true`, 
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                }
            }
        )).then(res => res.data[0])
    }

    async loginUser(username: string, password: string) {
        const form = {
            client_id: process.env.KEYCLOAK_CLIENT,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: "password",
            username,
            password
        }
        return await lastValueFrom(this.httpService.post(this.keycloakURL + "realms/troque-agora/protocol/openid-connect/token", 
            {...form},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )).then(res => res.data)
    }

    async refreshUserSession(refresh_token: string) {
        const form = {
            client_id: process.env.KEYCLOAK_CLIENT,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token
        }
        return await lastValueFrom(this.httpService.post(this.keycloakURL + "realms/troque-agora/protocol/openid-connect/token", 
            {...form},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )).then(res => res.data)
    }
    
    async logoutUser(sessionID: string) {
        const clientToken = await this.auth();
        return await lastValueFrom(this.httpService.delete(this.keycloakURL + "admin/realms/troque-agora/sessions/" + sessionID, 
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                }
            }
        )).then(res => res.data)
    }

    async deleteUser(userID: number) {
        const clientToken = await this.auth();
        return await lastValueFrom(this.httpService.delete(this.keycloakURL + "admin/realms/troque-agora/users/" + userID, 
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                }
            }
        ))
    }

    async sendVerifyEmail(username: string) {
        const clientToken = await this.auth();
        const {id} = await this.findUser(username);

        return await lastValueFrom(this.httpService.put(this.keycloakURL + "admin/realms/troque-agora/users/" + id + "/send-verify-email", {},
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                },
                params: {
                    redirect_uri: 'http://localhost:3000/login',
                    client_id: process.env.KEYCLOAK_CLIENT
                }
            }
        ))
    }

    async resetPassword(username: string) {
        const clientToken = await this.auth();
        const {id} = await this.findUser(username);

        return await lastValueFrom(this.httpService.put(
            this.keycloakURL + "admin/realms/troque-agora/users/" + id + "/execute-actions-email", 
            ["UPDATE_PASSWORD"], 
            {
                headers: {
                    Authorization: `Bearer ${clientToken}`
                },
                params: {
                    redirect_uri: 'http://localhost:3000/login',
                    client_id: process.env.KEYCLOAK_CLIENT
                }
            }
        ))
    }

    async introspectToken(token: string) {
        const form = {
            client_id: process.env.KEYCLOAK_CLIENT,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: "client_credentials",
            token
        }
        return await lastValueFrom(this.httpService.post(this.keycloakURL + "realms/troque-agora/protocol/openid-connect/token/introspect", 
            {...form},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )).then(res => res.data)
    }
}
