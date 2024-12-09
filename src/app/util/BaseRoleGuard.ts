import { Injectable,  } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { UserDTO } from "../classes/UserDTO";
import { AuthService } from "../service/authentication/auth-service";


@Injectable({
    providedIn: 'root'
  })
  export class BaseRoleGuard implements CanActivate {

    isUserAdmin: boolean = true
    user:UserDTO[] = [];
    constructor(private authService: AuthService, private router: Router) {}
   
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
          
       // this.checkUserRole().toPromise() ; //.toPromise().then((result) => {
        //this.isUserAdmin = result;     
        
        console.log(this.isUserAdmin)
        return this.isUserAdmin;

     } 

    //  checkUserRole(): Observable<boolean> {  
    //   const result = new Subject<boolean>()
    //   this.authService.getCurrentUser().subscribe(userReturned => {    
    //     debugger       
    //       let role:string = userReturned.role.roleName
          
    //       if(role === "ROLE_ADMIN" || role === "ROLE_MODERATOR")
    //         this.isUserAdmin = true
    //       else
    //         this.isUserAdmin = false

    //         }, error => {
    //           console.log("Error when try to consult user" + error.erro);
    //           this.router.navigate(['/error-page', 500])
    //         });    
            
    //         return new Observable<boolean>(observer => {observer.next(true)})
    //   }
  }