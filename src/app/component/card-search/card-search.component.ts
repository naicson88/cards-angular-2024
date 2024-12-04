import { Component, ElementRef, OnInit } from '@angular/core';
import { Imagens } from '../../util/Imagens';
import { CardService } from '../../service/card.service';
import { Router, RouterLink } from '@angular/router';
import { CardDTO } from '../../classes/CardDTO';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { MatIcon } from '@angular/material/icon';
import { CardInfoComponent } from '../tooltips/card-info/card-info.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'app-card-search',
  standalone: true,
  imports: [RouterLink, MatIcon, CardInfoComponent,MatProgressSpinnerModule, CommonModule, SearchBoxComponent],
  templateUrl: './card-search.component.html',
  styleUrl: './card-search.component.css'
})
//@Directive({ selector: 'img' })
export class CardsSearchComponent implements OnInit {

  constructor(private imagens: Imagens, private cardService: CardService,  private nativeElement:  ElementRef<HTMLImageElement>, private router: Router) {
    const supports = 'loading' in HTMLImageElement.prototype;

    // if (supports) {
    //   nativeElement.setAttribute('loading', 'lazy');
    // }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadRandomCards();
  }

  loading: boolean = true
  onLoad() {
    this.loading = false;

  }

  pageElement: any
  //Tooltip image
  topTp:any
  leftTp:any
  imgTooltip!: string;
  isShowTooltip: boolean = false;
  isShowTooltipDetailed: boolean = false;
  isRandomCards: boolean = true;
  totalFound!: number;


  panelOpenState = false;
  chosen!: string;
  cardsFound: CardDTO[] = [];
  cardsFromScroll: CardDTO[] = [];
  relUserCard: any;

  criterios = new Array();

  loadRandomCards() {
    this.cardsFound = [];

    this.cardService.randomCards().subscribe(data => {
      this.cardsFound = data;
    })
  }

 
  setCardsFound(e:any){
    this.pageElement = e.get('page');
    this.criterios = e.get('criterios')
    this.isRandomCards = false;
    this.cardsFound = this.pageElement.content
    console.log(this.pageElement)
  }

  cardImagem(cardId: any) {
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

  mostrarImgToolTip(img: string, e:any) {
    this.leftTp = e.pageX + 15 + "px";
    this.topTp = + e.pageY + 15 + "px";

    //this.imgTooltip = img;
    this.imgTooltip = e.target.src;
    this.isShowTooltip = true;
  }

  esconderImgToolTip() {
    this.isShowTooltip = false;
  }

  esconderImgToolTipDetailed() {
    this.isShowTooltipDetailed = false;
  }

  openCardDetail(numero: any) {
    debugger
    localStorage.setItem("idCard", numero);
  }

  cardImage!: string;
  card!: CardDTO;
  mostrarDivCardsInfo(e:any, cardNumber: any) {

    this.leftTp = e.pageX - 100 + "px";
    this.topTp = + e.pageY + 100 + "px";
    this.isShowTooltipDetailed = true;

    this.cardImage = GeneralFunctions.cardImagem + cardNumber + '.jpg';
    this.cardService.findByNumero(cardNumber).subscribe(card => { this.card = card });

  }

  onScroll() {
    if (this.isRandomCards)
      return;
    
    if(this.cardsFound.length >= this.pageElement.totalElements)
      return;

    const params = this.getRequestParam(this.pageElement.size, this.pageElement.number ++);

    this.cardService.searchCards(params, this.criterios).subscribe(newCards => {

      this.isRandomCards = false;
      this.totalFound = this.pageElement.totalElements

      this.cardsFromScroll = newCards;
      //this.relUserCard = GeneralFunctions.relUserCards(this.cardsFromScroll, this.cardService);

      this.cardsFromScroll.forEach(card => {
        this.cardsFound.push(card);
      });

    }, error => {
      console.log(error)
    })

  }


  getRequestParam(pageSize:number, page: number) {
    let params = {page: 0, size: 0 }
    
    if (page) {
      params[`page`] = page - 1;
    }
  
    if (pageSize) {
      params[`size`] = pageSize;
    }
  
    return params;

  }


}
