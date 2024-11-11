import { Observable, of } from "rxjs";
import { UserDTO } from "./auth-service";
import { AuthStrategy } from "./auth-strategy";
import { Token } from "./Token";

export class JwtAuthStrategy implements AuthStrategy<Token> {

    private readonly JWT_TOKEN = 'JWT_TOKEN'

    doLoginUser(token: Token): void {
        localStorage.setItem(this.JWT_TOKEN, token.accessToken)
    }

    doLogoutUser(): void {
        localStorage.removeItem(this.JWT_TOKEN)
    }

    getCurrentUser(): Observable<UserDTO> | undefined {
       const token = this.getToken();
       if(!token)
           return undefined

       const encodedPayload = token.split('.')[1];
       const payload = window.atob(encodedPayload)

       return of(JSON.parse(payload))
    }

    getToken(){ return localStorage.getItem(this.JWT_TOKEN)}
    
}