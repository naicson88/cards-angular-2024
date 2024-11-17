import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth-service";
import { JwtAuthStrategy } from "./strategy-auth-jwt";
import { AUTH_STRATEGY, AuthStrategy } from "./auth-strategy";
import { environment } from "../../../environments/environment";
import { Token } from "./Token";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
      private router: Router, 
      private authService: AuthService, 
      @Inject(AUTH_STRATEGY) private jwt: JwtAuthStrategy
  ) {}
    
  whiteList = ['/login','/confirmation','register', "confirm"]
   
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // DEPOIS IMPLEMENTAR ESTRATEGIA DE SESSION
       if(environment.authStrategy === 'token'){
            
            const token = this.jwt.getToken()
            const url = window.location.href

            if(token){
                if(url.includes("/index"))
                    this.router.navigate(['/home'])

                req = this.authService.addToken(req, token)
            } 

            else if(this.whiteList.some(wl => !url.includes(wl))) {
                this.authService.logout()
                this.router.navigate(['/index'])
            }

            //  var ip = sessionStorage.getItem("Address") === null ? 'NO IP' : sessionStorage.getItem("Address")
            //  if(ip === 'NO IP' && (!url.includes("/login") && !url.includes("/register"))) {
            //    this.authService.doLogoutAndRedirectToLogin();
            //    return null;
            //  }  

            // if(request.url != "http://api.ipify.org/?format=json")
            //   request = request.clone({headers: request.headers.append('X-Forwarded-For', ip)});

            return next.handle(req).pipe(catchError(error => {
      
                if(error.error.msg == 'Bad credentials'){
                  this.router.navigate(["/login", {data: true}])
                }
          
                else if (error.status === 401) {
                  this.authService.doLogoutUser();
                }
          
                else if (error.status === 500 && error.statusText != "Unknown Error") {
                  this.router.navigate(["/error-page", 500])
                }
          
                else if (error.statusText == "Unknown Error") {       
                  this.router.navigate(["/maintenence"])
                }
          
                else if (error.status === 404) {
                  this.router.navigate(["error-page", 404])
                }
          
                return throwError(error);
              })); 
            
       }

       return next.handle(req);
    }
    
}