import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../service/authentication/auth-service';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { MatIconButton } from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, MatIconButton, MatAutocompleteModule, ReactiveFormsModule, MatIconModule, MatMenuModule ],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        marginLeft: "260px"
      })),
      state('closed', style({
        marginLeft: "20px"
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ]),  
    ]),

    trigger('hideShowMenu', [
      // ...
      state('open', style({
        marginLeft: "0"
      })),
      state('closed', style({
        marginLeft: "-260px"
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ]),  
    ]),


    trigger('hideShowMenuOptions', [
      // ...
      state('open', style({
       display: 'block'
      })),
      state('closed', style({
        display: 'none'
      })),

    ]),

  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  isShowDeck: boolean = false;
  isShowCard: boolean = false;
  isIconeExpand: boolean = false;
  isIndex: boolean = false;
  isLogin: boolean = false;
  isRegister: boolean = false;
  isConfirmation: boolean = false;
  isAdminOrModerator: boolean = false;
  isConfirmed: boolean = false;
  isMaintenence: boolean = false

  generalSearchArr: GeneralSearchDTO[] = []
  dataCtrl = new FormControl('');
  filteredData: Observable<any[]>
  
  constructor(private router: Router, private authService: AuthService, private route: Router  ) {
    this.filteredData = this.dataCtrl.valueChanges.pipe(
      startWith('Dark'),
      map(data => {
        if (data && data.length > 2) {
          return this._filterStates(data);
        } else {
          return [];
        }
      }),
    );   
   }  

   private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    let arr : GeneralSearchDTO[] = [];
    arr = this.generalSearchArr.filter(data => {
      if(data == null || data.name == null)
        return;

      (data.name.toLowerCase().includes(filterValue)) || (data.setCode != null ? data.setCode.toLowerCase().includes(filterValue) : null)
    });
    return arr
  }
  
  ngOnInit() { 
    this.checkRouter();
    this.validUser();
   
  }

  checkRouter(){
    
    this.router.events.subscribe((event:any) => {
      
      if(event instanceof NavigationEnd) {

        if(event.url === '/index'){
          this.isIndex = true;
        } 
        else if(event.url.includes('/login')){
          this.isLogin = true;
        }
        else if(event.url.includes('/register')){
          this.isRegister = true
        } 
        else if(event.url.includes('/confirm-email')){
          this.isConfirmation = true;
        }
        else if (event.url.includes('/confirmation')){
          this.isConfirmed = true;
        }
        else if(event.url.includes('/maintenence')){
          this.isMaintenence = true;
        }
        
        else if(event.url === '/'){
          this.isIndex = true

        } else {
          this.isIndex = false;
          this.isLogin = false;
          this.isRegister = false;
        }
        
      }
    }) 
  }

  mostrarUlDecks(){

    if(this.isShowDeck == false){
     this.isShowDeck = true;
    } else {
      this.isShowDeck = false;
    }
  }

  mostrarUlCards(){
    if(this.isShowCard == false){
      this.isShowCard = true;
     } else {
       this.isShowCard = false;
     }
  }

  marginIconeLateral(trans: string){

    if(this.isIconeExpand == false){
      this.isIconeExpand = true;
     } else {
       this.isIconeExpand = false;
     }
  }

  logout() {
    this.authService.logout();
   // this.router.navigate(['/index'])
  }

  validUser(){
    GeneralFunctions.validUser(this.authService, this.router).subscribe(result => {
        this.isAdminOrModerator = result
    })
  }

  storeDeckId(id:any){
      GeneralFunctions.saveDeckInfoLocalStorage(0, "USER", "DECK");
  }

    generalSearch(e:any){
      let param = e.target.value
      
      if(param.length === 3 || param.length > 3 && this.generalSearchArr.length == 0){
        this.authService.generalSerach(param).subscribe(data => {
          this.generalSearchArr = data;
        })
      } 
    }

    clickedGeneralSearch(value:string){
      console.log(value)
    }

    cardImagem(cardId: any){
         
         let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
         return urlimg;
     }

     redirectToPage(data:GeneralSearchDTO){
      if(data.entityType == undefined || data.name == undefined)
        return;

      this.storeInformations(data.id, data.entityType, data.name)
     }

     storeInformations(id:any, setType:string, name:string){
      
      let arg = setType != 'CARD' ? 'idDeckDetails' : 'idCard'
      GeneralFunctions.saveDeckInfoLocalStorage(id, "konami", setType);

      if(setType == 'DECK')
       this.route.navigate(['/deck-details/', name]);
      else if(setType == 'CARD')
       this.route.navigate(['/card-detail/', name]);
      else if(setType == 'COLLECTION')
       this.route.navigate(['/collection-details/', name]);
      else
        console.log('ERROR: It was not possible redirect in General Search')
    }

    goToAccountManage() {
      this.router.navigate(['account-manager'])
    }

}

export class GeneralSearchDTO {
  id?:number;
  name?:string;
  entityType?:string;
  img?:string;
  setCode?:string
}