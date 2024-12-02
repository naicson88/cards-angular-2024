
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';
import { HandleErros } from '../util/HandleErros';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private router: Router) {}

  base_url = environment.devCardsMain

  public getStats(id:string, source:string, setType:string) {
      return this.http.get<any>(this.base_url+`/decks/set-stats?id=${id}&source=${source}&setType=${setType}`)
      .pipe(
          catchError(HandleErros.handleError)
      )
  }
}
