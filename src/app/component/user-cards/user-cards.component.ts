import { Component, ElementRef, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { QuantityRaritiesComponent } from '../shared/quantity-rarities/quantity-rarities.component';
import { CardInfoComponent } from '../tooltips/card-info/card-info.component';
import { CommonModule } from '@angular/common';
import { Imagens } from '../../util/Imagens';
import { CardService } from '../../service/card.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../../util/Spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { CardDTO } from '../../classes/CardDTO';
import { DialogUtils } from '../../util/Dialogs';
import { applyLoader } from '../../util/Decorators';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { DialogTypeEnum } from '../../enums/DialogTypeEnum';
import { CardOfUserDetailDTO } from '../../classes/CardOfUserDetailDTO';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-cards',
  standalone: true,
  imports: [PageHeaderComponent, QuantityRaritiesComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './user-cards.component.html',
  styleUrl: './user-cards.component.css'
})
export class UserCardsComponent {
  @ViewChild('btnNew',  { static: false }) btnNew!: ElementRef;

  constructor(private img: Imagens, private service: CardService, private router: Router,
    private dialog: MatDialog, private spinner: SpinnerService,   private toastr: ToastrService,) {
      this.dialogUtils = new DialogUtils(this.dialog);

     }

  cardsFromScroll = new BehaviorSubject([]);
  page: number = 1; 
  pageSize: number = 20;

  iconsMap:any;
  arrIcons = new Array();
  arrCards = new Array();
  arrCardsFromScroll = new Array();
  
  arrCardsDetails!:CardOfUserDetailDTO

  genericTypeAtual: string = 'MONSTER'

  cardname = '';

  //Serão enviadas para o tooltip
  cardImage!:string;
  card!:CardDTO;

  rarities: {} = {"teste": 0};
  konamiRarities = {} 

  mainTitle = "Your Card Collection"
  dialogUtils!: DialogUtils

  ngOnInit() {
    this.map();
    this.cardsByGenericType(this.genericTypeAtual);
  }

  map(){
    let iconsMap = this.img.mapCardsIcons();  
    iconsMap.forEach((img:string, value: string ) =>{
      let obj =  {'tipo': value, 'img': img}
      this.arrIcons.push(obj);
    },);
    console.log(this.arrIcons);
  }

  openSide(){
    let sideBar = (<HTMLInputElement>document.getElementById("mySidebar"));
    sideBar.style.width = "300px";
  }

  @applyLoader()
  cardsByGenericType(genericType:string){
    this.genericTypeAtual = genericType;
    const params = this.getRequestParam(this.pageSize, 0);

    if(genericType != null && genericType != " "){

      this.service.getCardsByGenericType(params, genericType).subscribe(data => {
        if(data.length > 0){
          this.arrCards = data;
          this.page = 2;
        } else {
          this.toastr.warning("No cards found with this type")
        }
          
      })

    }
  }

  cardImagem(cardId: any){
    // let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/' + cardId + '.jpg';
       let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
       return urlimg;
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

    onScroll(){
      const params = this.getRequestParam(this.pageSize, this.page);
    
      this.service.getCardsByGenericType(params, this.genericTypeAtual).subscribe(newCards => {
        this.arrCardsFromScroll = newCards;

        this.arrCardsFromScroll.forEach(card => {
          this.arrCards.push(card);
        });

        this.page = this.page + 1;
      })
    
    }

    isShowTooltip: boolean = false;
    imgTooltip!: string;
    topTp:any;
    leftTp:any;

    mostrarDivCardsInfo(e:any, cardNumber:any){

      this.leftTp =  e.pageX + 15 + "px";
      this.topTp = + e.pageY + 15 + "px";
      this.isShowTooltip = true;
     
      this.cardImage = GeneralFunctions.cardImagem + cardNumber + '.jpg';
      this.service.findByNumero(cardNumber).subscribe(card => {this.card = card  });
    
    }
 
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
    
    qtdTotal:number = 0;
    @applyLoader()
    cardOfUserDetails(cardId:number) {            

        this.service.cardOfUserDetails(cardId).subscribe({
          next: (data: CardOfUserDetailDTO) =>{
            let qtd = 0;
            this.arrCardsDetails = data;
            console.log(data)
            this.arrCardsDetails.setsWithThisCard.forEach(element => {
              qtd += element.quantity 
            });
  
            this.rarities = this.arrCardsDetails['rarity']
            this.qtdTotal = qtd;
          }

        });

       
    }

    setRarityColor(rarity:string){
      return GeneralFunctions.colorRarity(rarity);
    }
    @applyLoader()
    searchCardsByName(){
              
        if(this.cardname != null && this.cardname != ""){

          if(this.cardname.length <= 3){ 
            this.dialogUtils.showDialog("Please write at least 4 characteres", DialogTypeEnum.WARNING);
            return;
          }

          this.service.searchCardsByName(this.cardname).subscribe(data=>{
         
            if(Object.keys(data).length > 0 ){
              this.arrCards = data;
            }
            else{
              this.dialogUtils.showDialog("No cards found with this name!", DialogTypeEnum.ERROR)
            }
            
          })

        } else {
          this.dialogUtils.showDialog("Fill the field with a Card name!", DialogTypeEnum.WARNING);
          return;
        }
    }

    storedCardId(event:any){
        const id = event.target.name;
        localStorage.setItem("idCard", id);
      }

      storeDeckId(id:any, setType:string){
         
      let modal = (document.getElementById('closeModalBtn') as HTMLElement);
      modal.click();
    //  const id = event.target.name;
      // localStorage.setItem("idDeckDetails", id);
      // localStorage.setItem("source", "USER");
      // localStorage.setItem("set_type", setType);
      GeneralFunctions.saveDeckInfoLocalStorage(id, "user", setType);
      this.router.navigate(['/user-deck-details/', 'sets.setName'])
      
    }
  }
