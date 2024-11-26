import { Injectable } from '@angular/core';
import { CardDTO } from '../classes/CardDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable } from 'rxjs';
import { HandleErros } from '../util/HandleErros';
import { RelDeckCardsDTO } from '../classes/RelDeckCardsDTO';
import { SearchCriteriaDTO } from '../classes/SearchCriteriaDTO';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  card!: CardDTO;
  private cardNumber!: number;

  constructor(private http: HttpClient) {}
  
  base_url = environment.devCardsMain

  
  getCardNumber(){
    return this.cardNumber;
  }

  public getCards(params:any){
    return  this.http.get<CardDTO[]>(this.base_url+"/decks/todos")
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public getCardsUserCollection(cardType: string){
      return this.http.get<CardDTO[]>(this.base_url+`/cards/usercollection/${cardType}`)
      .pipe(
        catchError(HandleErros.handleError)
      )
  }

  public findByNumero(numero:any) {  
    return this.http.get<CardDTO>(this.base_url+`/cards/number/${numero}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public getCardDetails(id:any) {   
    return this.http.get<any[]>(this.base_url+`/cards/number/${id}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public searchCards(params:any, criterios:SearchCriteriaDTO[]){
    return this.http.post<CardDTO[]>(this.base_url+`/cards/searchCard?size=${params.size}&page=${params.page}`, criterios)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  
  public searchCardsDetailed(params:any, criterios:SearchCriteriaDTO[]){
    return this.http.post<any>(this.base_url+`/cards/searchCardDetailed?size=${params.size}&page=${params.page}`, criterios)
      .pipe(
        catchError(HandleErros.handleError)
      )
  }

  public randomCardDTOs(){
    return this.http.get<CardDTO[]>(this.base_url+"/cards/randomCards")
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public relUserCards(cardsNumbers:number[]){
    return this.http.get<any[]>(this.base_url+`/cards/rel-user-cards?cardsNumbers=${cardsNumbers}`)
    .pipe(
      catchError(HandleErros.handleError)
    );
  }

  public getCardsByGenericType(params:any, genericType: string): Observable<any>{
    return  this.http.get<any[]>(this.base_url+`/cards/load-cards-userscollection?size=${params.size}&page=${params.page}&genericType=${genericType}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  } 

  public cardOfUserDetails(cardId:number) {
    return this.http.get<any>(this.base_url+`/cards/card-user-details?cardId=${cardId}`)
    .pipe(
        catchError(HandleErros.handleError)
      )
  }

  public searchCardsByName(cardName: string) {
    return this.http.get<any>(this.base_url+`/cards/cardname-usercollection?cardName=${cardName}`)
    .pipe(
      
      catchError(HandleErros.handleError)
    )
  }

  public findAllRelDeckCardsByCardNumber(cardId:any){
    return this.http.get<RelDeckCardsDTO[]>(this.base_url+`/cards/search-cardSetcodes?cardId=${cardId}`)
      .pipe(
        catchError(HandleErros.handleError)
      )
  } 

}
