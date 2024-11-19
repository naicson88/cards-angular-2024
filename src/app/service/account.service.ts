import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ManageAccount } from '../component/account/account.component';
import { catchError } from 'rxjs';
import { HandleErros } from '../util/HandleErros';
import { ApiResponseDTO } from '../classes/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router ) {}
  
  base_url = environment.devCardsMain

  public changeAccountInformation(account: ManageAccount) {
      return this.http.post<ApiResponseDTO>(this.base_url+`/auth/change-account-information`, account) 
      .pipe(
        catchError(HandleErros.handleError)
      )
       
    }
}
