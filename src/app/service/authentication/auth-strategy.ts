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
                console.log("SESSION STRATEGY")
                return new SessionAuthStrategy(http);
            case 'token':
                console.log("TOKEN STRATEGY")
                return new JwtAuthStrategy();
        }
    }
}

// @NgModule({
//     imports: [CommonModule, HttpClientModule],
//     providers: [
//       {
//         provide: AUTH_STRATEGY,
//         useValue: authStrategyProvider, // Você pode usar useClass, useValue, etc., dependendo de como quer fornecer a implementação
//       },
//     ],
//     bootstrap: [AppComponent]
//   })
//   export class AuthModule {}