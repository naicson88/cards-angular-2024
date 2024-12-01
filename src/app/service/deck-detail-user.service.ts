import { Injectable } from '@angular/core';
import { CardDTO } from '../classes/CardDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';
import { HandleErros } from '../util/HandleErros';

@Injectable({
  providedIn: 'root'
})
export class DeckDetailUserService {

  card!: CardDTO;

  constructor(private http: HttpClient) {}
  
  base_url = environment.devCardsMain

  public randomCardsDetailed(){
      return this.http.get<CardDTO[]>(this.base_url+"/cards/randomCardsDetailed")
      .pipe(
        catchError(HandleErros.handleError)
      )
    }
}
