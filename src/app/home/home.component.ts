import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../component/footer/footer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { GeneralFunctions } from '../util/GeneralFunctions';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, RouterLink, SlicePipe, CurrencyPipe ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  username: any;
  user: any;

  constructor( private service: HomeService, private router :Router, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
   // this.getUser();
    this.loadHomeInfo();
  }

    infoHome!: HomeDTO
    img:string = ''

    loadHomeInfo(){
      this.service.loadHomeInfo().subscribe({
        next: (info: HomeDTO) => {
          console.log(info)
          this.infoHome = info;
          //this.img = this.infoHome['lastSets'].img
        }, 
        error: (error: any) => {
          let errorCode = error.status;
          this.router.navigate(["/error-page", errorCode]);
        }
      })
    }
    
     storeDeckId(id:any, setType:string, source:string){      
        setType =  setType != 'DECK' ? 'COLLECTION' : 'DECK'
        GeneralFunctions.saveDeckInfoLocalStorage(id, source, setType);     
     }

}

export class HomeDTO {
    id?: number;
    qtdDeck?: number;
    qtdBoxes?: number; 
    qtdTins?: number; 
    qtdCards?: number;
    hotNews!: HotNewsDTO[]
    lastSets?: LastSetsDTO[]
    lastCards?: LastCardsDTO[]
    highCards?: HighCardsDTO[]
    lowCards?: LowCardsDTO[]
    weeklyMostView?: WeeklyMostViewDTO[]
}

export class HotNewsDTO {
  id?: number;
  name?: string;
  setCode?: string;
  price?: string;
  img?: string;
  cardNumber?: string;
  registeredDate?: string;
  setType!: string;
}

export class LastSetsDTO extends HotNewsDTO {}
export class LastCardsDTO extends HotNewsDTO {}
export class HighCardsDTO {
  cardName?: string;
  cardNumber?: number;
  setCode?: string;
  percentVariable?: number;
  cardPrice?: number;
  qtdViewsWeekly?: number;
}
export class LowCardsDTO extends HighCardsDTO {}
export class WeeklyMostViewDTO extends HighCardsDTO {} 