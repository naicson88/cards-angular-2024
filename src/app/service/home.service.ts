
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { Router } from "@angular/router"
import { catchError, Observable } from "rxjs"
import { Injectable } from "@angular/core"
import { HomeDTO } from "../component/home/home.component"
import { HandleErros } from "../util/HandleErros"
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, private router: Router ) {}
  
  base_url = environment.devCardsMain

  public loadHomeInfo() :Observable<HomeDTO> {
   
    return  this.http.get<HomeDTO>(this.base_url+`/home/info`) 
    .pipe(
      catchError(HandleErros.handleError)
    )   
  }


}
