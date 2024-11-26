import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardService } from '../../service/card.service';
import { ArchetypeService } from '../../service/archetype.service';
import { SpinnerService } from '../../util/Spinner';
import { CardDTO } from '../../classes/CardDTO';
import { Paths } from '../../enums/Paths';
import { applyLoader } from '../../util/Decorators';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import {Chart} from 'chart.js';
import { PageHeaderComponent } from "../shared/page-header/page-header.component";
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterlinkStoreIdComponent } from "../routerlink-store-id/routerlink-store-id.component";
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'



@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [PageHeaderComponent, SlicePipe, CommonModule, RouterlinkStoreIdComponent, RouterLink,  MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule, ],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent implements OnInit {
  @ViewChild("attrCanvas",{static: true}) elemento!: ElementRef;
  raridade!:string;

  constructor(private router: Router, private service: CardService, private archService: ArchetypeService, private  spinner: SpinnerService) { }
  
  ngOnInit() {
    this.loadCardDetail();
    this.cardPriceGrafic();
    window.scrollTo(0, 0); 
  }

  card!: CardDTO;
  //userKonamKoiCollectionMap: Map<any,any>
  userHaveByUserCollection!: Map<any, any>;
  userHaveByUserCollectionFiltered!: string[]
  qtdUserHasTotal!: number
  konamiSets = ([] as any[]);
  totalViews!:number;
  isLINKCard: boolean = false;
  cardTypes:string = "";
  alternativeCardNumber = ([] as any[]);;
  mainTitle = "Card's Details"

  keyIsFound!:boolean;
  archetypeDetail = Paths['ARCHETYPE_DETAIL']

  @applyLoader()
  loadCardDetail(){

    let idd =  Number(localStorage.getItem("idCard"));

      this.service.getCardDetails(idd).subscribe({ 
        next: (data:any) => {
          this.card = data['card'];
          this.konamiSets = data['konamiSets'];
          this.alternativeCardNumber = data['card']['alternativeCardNumber']
          this.qtdUserHasTotal = data['qtdUserHasTotal']
          //console.log(this.card)
         // this.qtdUserHaveByKonamiCollection(data);
          this.qtdUserHaveByUserCollection(data);
          this.totalViews = data['views']['totalQtdViews'];
          this.verifyIfIsLinkCard(data);
          this.setCardTypes(data)
      
        }, 
        error: (error) => {
          console.log(error)    
        }
      }
    )  
    
  }

  setRarityColor(rarity:string){
    return GeneralFunctions.colorRarity(rarity);
  }

  setCardTypes(data:any){
    let card = data['card'];
    this.cardTypes += card.tipo.name;

    if(card.genericType == 'XYZ' )
      this.cardTypes += " / XYZ";
    else if(card.genericType == 'FUSION')  
      this.cardTypes += " / Fusion";
    else if(card.genericType == 'LINK') 
      this.cardTypes += " / Link"; 
    else if(card.genericType == 'SYNCHRO' )
      this.cardTypes += " / Synchro"; 
    else if(card.genericType == 'PENDULUM' )
      this.cardTypes += " / Pendulum";   
    if(card.categoria.includes('Toon'))
      this.cardTypes += " / Toon"; 
    if(card.categoria.includes('Effect'))
      this.cardTypes += " / Effect"; 
    if(card.categoria.includes('Flip'))
      this.cardTypes += " / Flip"; 
    if(card.categoria.includes('Tuner'))
      this.cardTypes += " / Tuner"; 

  }

  verifyIfIsLinkCard(data:any){
      let card = data['card'];
      if(card.genericType == 'LINK')
        this.isLINKCard = true;
  }

  cardImagem(cardId: any){
   // let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/' + cardId + '.jpg';
      let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
      return urlimg;
  }

   storeDeckId(id:any, set_type:string){
    let set = set_type != 'DECK' ? 'COLLECTION' : 'DECK'
    // let map = new Map<string, any>([
    //   ["idDeckDetails", id],
    //   ["source", "konami"],
    //   ["set_type", set],
    // ]);
     GeneralFunctions.saveDeckInfoLocalStorage(id, "konami", set);
    // GeneralFunctions.storeDataLocalStorage(map);
    // GeneralFunctions.storeInformation("idDeckDetails", id, 'konami', set)
  }

  atributoImagem(atributo:string) : any{
    switch(atributo){
      case 'WATER':
      return '..\\..\\assets\\img\\outras\\WATER.png';
      case 'EARTH':
        return '..\\..\\assets\\img\\outras\\TERRA.png';
      case 'FIRE':
        return '..\\..\\assets\\img\\outras\\FIRE.png';
      case 'LIGHT':
        return '..\\..\\assets\\img\\outras\\LUZ.png';
      case 'DARK':
        return '..\\..\\assets\\img\\outras\\DARK.png';
      case 'WIND':
        return '..\\..\\assets\\img\\outras\\WIND.png';
        case 'Spell Card':
          return '..\\..\\assets\\img\\outras\\MAGIA.png';
        case 'Trap Card':
          return '..\\..\\assets\\img\\outras\\ARMADILHA.png';
        case 'Continuous':
          return '..\\..\\assets\\img\\outras\\Continuous.png';
        case 'Field':
          return '..\\..\\assets\\img\\outras\\Field.png';
        case 'Quick-Play':
            return '..\\..\\assets\\img\\outras\\Quick.png';
        case 'Counter':
          return '..\\..\\assets\\img\\outras\\Counter.png';
        case 'Equip':
          return '..\\..\\assets\\img\\outras\\Equip.jpg'; 
        case 'Ritual':
            return '..\\..\\assets\\img\\outras\\Ritual.jpg'; 
    }
    
  }

  corRaridade(raridade:string){  
    if(raridade == 'Common'){
      this.raridade = "C";
      return "comum";
    }
    if(raridade == 'Rare'){
      this.raridade = "R";
      return "raro";
    }
    if(raridade == 'Super Rare'){
      this.raridade = "SR"
      return "super-raro";
    }
    if(raridade == 'Ultra Rare'){
      this.raridade = "UR";
      return "ultra-raro";
    }

    if(raridade == 'Secret Rare'){
      this.raridade = "ScR";
      return "secret-rare";
    }

    return ''

  }

  
  isShowTooltip: boolean = false;
  imgTooltip!: string;
  topTp?:any
  leftTp?:any

  mostrarImgToolTip(e:any){

      this.leftTp =  e.pageX + 15 + "px";
      this.topTp = + e.pageY + 15 + "px";
 
      //this.imgTooltip = img; se necessario coloca mais um argumento, o caminho da imagem
      this.imgTooltip = e.target.src;
      this.isShowTooltip = true;
   }
 
   esconderImgToolTip(){
    this.isShowTooltip = false;
  }

  cardPriceGrafic(){

  const data = {
    labels: ['5 Weeks ago', '4 Weeks ago', '3 Weeks ago', '2 Weeks ago', 'Current'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [12.30,21,23,25,30,10],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0)',
      },
      {
        label: 'Dataset 2',
        data: [19,30,10,25,31,11],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0)',
      }
    ]
  };

    new Chart(this.elemento.nativeElement, {
      type: 'line',
      data: data,
      options: {
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
                }
            }]
        },
          plugins:{
            legend: {
              labels: {
                usePointStyle: true
              }
            }
          },
          responsive: true

      }
    });
  }

  //  qtdUserHaveByKonamiCollection(data:any) {
  //    // console.log(JSON.stringify(data['qtdUserHaveByKonamiCollection']));
  //   let  result = Object.entries(data['qtdUserHaveByKonamiCollection']);
  //   this.userKonamiCollectionMap = new Map(result);
  //  // console.log(this.userKonamiCollectionMap);
  //  }

     qtdUserHaveByUserCollection(data:any){
     let result = Object.entries(data['qtdUserHaveByUserCollection']);  
     this.userHaveByUserCollection = new Map(result); 
   }

   filterMapSetCode(setCode:string){
    this.userHaveByUserCollectionFiltered  = [];
    this.userHaveByUserCollectionFiltered = this.userHaveByUserCollection.get(setCode)
   }

   checkIfKeyExist(key:string): boolean{
      if(this.userHaveByUserCollection.get(key))
          return true;
      else
          return false;
   }

   getSetByName(setName:any){
      let modal = (document.getElementById('closeModalBtn') as HTMLElement);
      modal.click();
      let rightName = setName.substring(0, setName.indexOf("(")).trim();     
      this.router.navigate(['userdeck-details', rightName],  { queryParams: { order: 'popular' }})
   }

   seeCropped() {
      let img = (document.getElementsByClassName('active')[0] as HTMLElement);
      let rawUrl:any = img.firstChild
      let cardId = rawUrl['src'].split("cards/")[1]
      window.open(GeneralFunctions.croppedImage+cardId, "_blank");
   }
}
