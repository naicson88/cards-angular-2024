import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { Router } from "@angular/router"
import { catchError } from "rxjs"

export class HomeService {

    constructor(private http: HttpClient, private router: Router ) {}
  
    base_url = environment.devCardsMain
  
    public loadHomeInfo() {
      return this.http.get<any>(this.base_url+`/home/info`) 
    //   .pipe(
    //     catchError(HandleErros.handleError)
    //   )   
    }
  }