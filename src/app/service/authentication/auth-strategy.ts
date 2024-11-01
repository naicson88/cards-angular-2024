import { Observable } from "rxjs"
import { UserDTO } from "./auth-service"
import { InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtAuthStrategy } from "./strategy-auth-jwt";
import { SessionAuthStrategy } from "./strategy -auth-session";
import { environment } from "../../util/envirioments/dev-envirioment";

export interface AuthStrategy<T> {
    doLoginUser(data: T) : void
    doLogoutUser(): void
    getCurrentUser(): Observable<UserDTO>
}

export const AUTH_STRATEGY = new InjectionToken<AuthStrategy<any>>('AuthStrategy');

export const authStrategyProvider = {
    provider: AUTH_STRATEGY,
    deps: [HttpClient],
    
    userFactory: (http: HttpClient): any => {
        switch(environment.authStrategy){
            case 'session':
                return new SessionAuthStrategy(http);
            case 'token':
                return new JwtAuthStrategy();
        }
    }
}