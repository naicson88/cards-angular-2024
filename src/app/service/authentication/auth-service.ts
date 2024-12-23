import { inject, Inject, Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpRequest } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
import { LoginRequestDTO } from "../../component/index/login/login.component";
import { AUTH_STRATEGY, AuthStrategy } from "./auth-strategy";
import { environment } from "../../../environments/environment";
import { Token } from "./Token";
import { JwtAuthStrategy } from "./strategy-auth-jwt";

@Injectable({
    providedIn: 'root',
})

  export class AuthService {
    
    private readonly JWT_TOKEN = 'JWT_TOKEN'
    private readonly LOGIN_PATH = '/login'
    private readonly CONFIRM_PATH = '/confirm'
    readonly INITIAL_PATH = '/home'

    userRole : String = '';
    userName: String = ''
    user: any;
    base_url = environment.devCardsMain


    constructor( 
        private router: Router, 
        private http: HttpClient,
        @Inject(AUTH_STRATEGY) private auth: JwtAuthStrategy

    ){}

    signup(user: UserDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(this.base_url+`auth/signup`, user )
    }

    login(loginRequest: LoginRequestDTO): Observable<UserDTO>{
        
        return this.http.post<any>(this.base_url+`/auth/login`, loginRequest)
            .pipe(tap(user => {
                console.log(user)
                localStorage.setItem(this.JWT_TOKEN, user.accessToken)
               // this.auth.doLoginUser(user)
            }));
    }

    getUserLoggedIn(username: string){
        return this.http.get<UserDTO>(`${this.base_url}/User/consulta-usuario/${username}`)
    }

    logout(){
        localStorage.removeItem(this.JWT_TOKEN)
        localStorage.removeItem('userRole')
        this.router.navigate(['/index'])
    }

    isLoggedIn(): Observable<boolean> | undefined{
        return this.auth.getCurrentUser()?.pipe(
            map(user => !!user),
            catchError(() => of(false))
        )
    }

    getCurrentUser(): Observable<UserDTO> | undefined{
        return this.auth.getCurrentUser();
    }

    doLogoutUser() {
        this.auth.doLogoutUser();
        this.router.navigate(["/index"])
      }
    
    getCurrentUser$(): Observable<UserDTO> | undefined{
        return this.auth.getCurrentUser();
      }
    
    
  resendPassword(email:string){
    return this.http.get<any>(this.base_url+`/auth/resend-password?email=${email}`)
  }

  confirmPassword(pass:string){
    return this.http.get<any>(this.base_url+`/auth/confirm-password?pass=${pass}`)
  }

  validTokenToChangePassword(token: string) {
    return this.http.get<any>(this.base_url+`/auth/check-token-password?token=${token}`)
  }

  changePassword(user: any) {
    return this.http.post<any>(this.base_url+'/auth/change-password?token', user);
  }

  checkServerStatus(){
    return this.http.get<any>(this.base_url+"actuator/health")
  }

  generalSerach(param:string){
    return this.http.get<any>(this.base_url+`/home/general-search?param=${param}`)
  }

  getIpAddress(): Observable<string> {
    return this.http.get<any>("http://api.ipify.org/?format=json").pipe(map(res => res.ip));
  }

  
   addToken(request: HttpRequest<any>, token:string) {
    return request.clone({
        setHeaders: { 'Authorization' : `Bearer ${token}` }
   })
  }

   isUserAdmin(userName:string): Observable<any> {
      let response = this.http.get<any>(this.base_url+`/auth/is-admin/${userName}`)
      return response;
   }
}

  

  export class UserDTO {
    id!: number;
    email!: string;
    password!:string;
    role?: any
    username!: string;
    verificationToken!:string
    maxDateValidation!:Date
    isEmailConfirmed!:boolean
    accessToken!: string
  }