import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';
import { HandleErros } from '../util/HandleErros';

@Injectable({
  providedIn: 'root'
})
export class ChangeArtService {

  constructor(private http: HttpClient) {}
  base_url = environment.devCardsMain

  public getAlternativeNumbers(cardId:number) {
     return this.http.get<[number]>(this.base_url+`/cards/get-alternative-numbers?cardId=${cardId}`) 
     .pipe(
       catchError(HandleErros.handleError)
     )  
   }
}
