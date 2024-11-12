import { Observable } from "rxjs"
import { UserDTO } from "./auth-service"
import { InjectionToken, NgModule } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { JwtAuthStrategy } from "./strategy-auth-jwt";
import { SessionAuthStrategy } from "./strategy -auth-session";
import { environment } from "../../../environments/environment";
import { CommonModule } from "@angular/common";
import { AppComponent } from "../../app.component";


export interface AuthStrategy<T> {
    doLoginUser(data: T) : void
    doLogoutUser(): void
    getCurrentUser(): Observable<UserDTO> | undefined
}

export const AUTH_STRATEGY = new InjectionToken<AuthStrategy<any>>('AuthStrategy');


export const authStrategyProvider = {
    // providers: [{
    //     provide: AUTH_STRATEGY,
    //     useValue: ''
    // }],
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
