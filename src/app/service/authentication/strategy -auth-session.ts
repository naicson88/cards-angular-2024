import { Observable, of } from "rxjs";
import { UserDTO } from "./auth-service";
import { AuthStrategy } from "./auth-strategy";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../util/envirioments/dev-envirioment";

export class SessionAuthStrategy implements AuthStrategy<UserDTO> {

    constructor(private http: HttpClient){}

    private loggedUser: UserDTO | undefined
    base_url = environment.devCardsMain

    doLoginUser(data: UserDTO): void {
        this.loggedUser = data;
    }

    doLogoutUser(): void {
      this.loggedUser = undefined;
    }

    getCurrentUser(): Observable<UserDTO> | undefined {
      throw new Error("Method not implemented.");
    }

//     getCurrentUser(): Observable<User> {
//         if(this.loggedUser){
//             return of(this.loggedUser);
//         }else {
//             return this.http.get<User>(`${configg.authUrl}/User/${this.loggedUser.id}`)
//              .pipe(tap(user => this.loggedUser = user));
//         }
//      }
     
//  }
 
//  function tap(arg0: (user: any) => any): import("rxjs").OperatorFunction<User, User> {
//      throw new Error("Function not implemented.");
//  }
    
}