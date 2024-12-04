import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { UserSetCollectionDTO } from "../classes/UserSetCollectionDTO";
import { HandleErros } from "../util/HandleErros";


@Injectable({
  providedIn: 'root'
})
export class UserSetcollectionService {


  userSet!: UserSetCollectionDTO

  constructor(private http: HttpClient, private router: Router) {}

  base_url = environment.devCardsMain

  public getSetCollection(setId:any) {

      return this.http.get<UserSetCollectionDTO>(this.base_url+`/user-setcollection/consult/${setId}`) 
      .pipe(
        catchError(HandleErros.handleError)
      )
       
    }
 
  public saveSetCollection(userCollection: UserSetCollectionDTO) {
    return this.http.post<any>(this.base_url+`/user-setcollection/save-set-collection`, userCollection) 
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

     
  public createBasedDeck(deckId:any) {
    return this.http.post<any>(this.base_url+`/userDeck/create-based-deck`, deckId) 
    .pipe(
      catchError(HandleErros.handleError)
    )
  }
}
