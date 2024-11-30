import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';
import { HandleErros } from '../util/HandleErros';

@Injectable({
  providedIn: 'root'
})
export class PriceUpdateService {

  constructor(private http: HttpClient, private router: Router ) {}
  base_url = environment.devCardsAdmin

  public updateSetPrice(name:string) {
     return this.http.get<[number]>(this.base_url+`/price/update-deck-price?deckName=${name}`) 
     .pipe(
       catchError(HandleErros.handleError)
     )  
   }
}
