import { AfterContentInit, AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardService } from '../../service/card.service';
import { SpinnerService } from '../../util/Spinner';
import { DeckService } from '../../service/deck.service';
import { DeckDetailUserService } from '../../service/deck-detail-user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { DeckDTO } from '../../classes/DeckDTO';
import { CardDTO } from '../../classes/CardDTO';
import { RelDeckCardsDTO } from '../../classes/RelDeckCardsDTO';
import { DialogUtils } from '../../util/Dialogs';
import { applyLoader } from '../../util/Decorators';
import { DialogTypeEnum } from '../../enums/DialogTypeEnum';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { GenericTypeCard } from '../../enums/GenericTypeCard';
import { ECardRarities } from '../../enums/ECardRarities';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { QuantityRaritiesComponent } from '../shared/quantity-rarities/quantity-rarities.component';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CardInfoComponent } from '../tooltips/card-info/card-info.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SearchBoxComponent } from '../search-box/search-box.component';


@Component({
  selector: 'app-deck-detail-user',
  standalone: true,
  imports: [PageHeaderComponent, MatFormField, MatLabel, MatHint, QuantityRaritiesComponent, MatIcon, RouterLink, CommonModule, CardInfoComponent,
    MatCheckboxModule
  ],
  templateUrl: './deck-detail-user.component.html',
  styleUrl: './deck-detail-user.component.css'
})
export class DeckDetailUserComponent implements OnInit, AfterContentInit , AfterViewChecked {
  @ViewChild('btnSpan',{static: false})span!:ElementRef;
  @ViewChild('dropListContainer',{static: false}) dropListContainer?: ElementRef;
  @ViewChild('deckName', {static:false}) deckNome!:ElementRef

  constructor(private cardService: CardService, private ref: ElementRef, private router :Router, private spinner: SpinnerService,
    private deckService: DeckService, private deckDetailUSerService: DeckDetailUserService,  private toastr: ToastrService, public dialog: MatDialog) { 
      this.dialogUtils = new DialogUtils(this.dialog);
    }

  dropListReceiverElement?: HTMLElement;

  toManage = false;

  cardsFromScroll = new BehaviorSubject([]);
  arrCardsFromScroll = new Array();
  page: number = 1; 
  pageSize: number = 30;


  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

   typeCard = {
     monster:0,
     magic:0,
     trap:0,
     synchro:0,
     xyz:0,
     fusion:0,
     link:0
   } 

deck!:DeckDTO 

arrayCards = new Array();
 
mainDeckCards: CardDTO[] = [];

extraDeckCards: CardDTO[] = [];

sideDeckCards: CardDTO[] = [];

relDeckCards: RelDeckCardsDTO[] = [];

mapSetCodes: Map<number, RelDeckCardsDTO[]> = new Map();

cardsSearched: number[] = []; // Guarda o numero dos cards que ja tiveram Setcode consultados

rarities ={};

mainTitle = "Your Deck"

dialogUtils!:DialogUtils 

  @applyLoader()
  ngOnInit() {

    this.loadDeckCards();
    this.loadRandomCards();
  }

    ngAfterContentInit  (){
      this.setRarityClassAndPriceTitle()
    }

    ngAfterViewChecked() {
      //this.setRarityClassAndPriceTitle()
    }


  storedCardId(cardNumber:any){
    debugger
    sessionStorage.setItem("idCard", cardNumber);
  }

@applyLoader()
loadDeckCards(): void {
  
    const id = sessionStorage.getItem("idDeckDetails");
    
    if(id == "0"){
      this.dialogUtils.showDialog('Create your new Deck!', DialogTypeEnum.INFO);
      this.deck = new DeckDTO();
      this.deck.id = 0;
      this.deck.nome = "";
      return;
    }

    this.deckService.editDeck(id, "User").subscribe({
      next: (data) => {
        this.deck = data

        this.mainDeckCards = data['cards']!
        this.countTypeCards(this.mainDeckCards, "main");

        this.extraDeckCards =  data['extraDeck'] 
        this.countTypeCards(this.extraDeckCards, "extra");

        this.sideDeckCards = data['sideDeckCards'];
        this.relDeckCards =  data['rel_deck_cards'];
        this.calculateDeckPrice(this.relDeckCards);
        this.setRelDeckCards();
      },
    
      error: (error) =>{
        let errorCode = error.status;
        this.router.navigate(["/error-page", errorCode]);
      }
  })
}


loadRandomCards(){
    this.arrayCards = [];
    
    this.deckDetailUSerService.randomCardsDetailed().subscribe({
      next: (cards) =>{
        this.validTypeDeckCard(cards);
      },
      error: (error) =>{
        let errorCode = error.status;
        this.router.navigate(["/error-page", errorCode]);
      } 
    },
   )
}

validTypeDeckCard(cards:CardDTO[]){
  
  for(var i = 0; i < cards.length; i++){

    let card:CardDTO = cards[i] ;

    Object.assign(cards[i], {isExtraDeck: null})

      if(card != null && card != undefined && card.genericType != undefined){

        let isExtraDeckCard = GeneralFunctions.isExtraDeckCard(card.genericType);

        if(isExtraDeckCard)
          card.isExtraDeck = true;
        else {
          card.isExtraDeck = false
        }

        this.arrayCards.push(card);
      } 
   
   }
}

setRarityClassAndPriceTitle(){
  this.mainDeckCards.forEach((card, index) => {
    this.setDeckRarityItems(index,card,'main_hidden_','main_hidden_price_')
  });

  this.extraDeckCards.forEach((card, index) => {
    this.setDeckRarityItems(index,card,'extra_hidden_','extra_hidden_price_')
  });

  this.sideDeckCards.forEach((card, index) => {
    this.setDeckRarityItems(index,card,'side_hidden_','side_hidden_price_')
  });
  
  this.calculateQtdRarity();
}

private setDeckRarityItems(index:number, card:CardDTO, firstId:string, secondId:string){
  let hiddenRarity = document.getElementById(firstId+index)
  let hiddenPrice = document.getElementById(secondId+index);

  if(hiddenPrice != null && hiddenRarity != null && card.price != undefined){
    hiddenRarity.className = GeneralFunctions.rarity(card.raridade)   
    hiddenPrice.title = card.price.toFixed(2);
  }
 
}

countTypeCards(data:CardDTO[], deck:string){
      if(deck === 'main'){
       // console.log(data)
        this.typeCard.monster = data.filter(card => card.nivel != null).length;
        this.typeCard.magic = data.filter(card => card.genericType === GenericTypeCard.SPELL).length;
        this.typeCard.trap = data.filter(card => card.genericType === GenericTypeCard.TRAP).length;

      } else if (deck === 'extra'){
  
        this.typeCard.synchro = data.filter(card => card.genericType === GenericTypeCard.SYNCHRO).length;
        this.typeCard.xyz = data.filter(card => card.genericType === GenericTypeCard.XYZ).length;
        this.typeCard.fusion = data.filter(card => card.genericType === GenericTypeCard.FUSION).length;
        this.typeCard.link = data.filter(card => card.genericType === GenericTypeCard.LINK).length;

      } else {
        alert("It was not possible count some deck cards. :( ")
      }
  }

setRelDeckCards(){
  
  this.mainDeckCards.forEach((card) => {  
     this.setRelDeckCardsTypeDeck(card);
   });

  this.extraDeckCards.forEach((card) => {
    this.setRelDeckCardsTypeDeck(card);
  }) 

  this.sideDeckCards.forEach((card) => {    
    this.setRelDeckCardsTypeDeck(card);
  }) 

}

setRelDeckCardsTypeDeck(card:CardDTO){

  try {
    card.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    let rel = this.relDeckCards.find(rel => rel.cardId === card.id);
    let relIndex = this.relDeckCards.findIndex(rel => rel.cardId === card.id);
    if(rel == undefined || rel == null){
      this.dialogUtils.showDialog("Sorry, some error happened, try again later!", DialogTypeEnum.ERROR);
      return false;
    }
  
   let arr = []
   arr.push(rel)
   card.relDeckCards = arr;
   card.raridade = rel.card_raridade
   card.price = rel.card_price
  
   this.relDeckCards.splice(relIndex, 1); 

  } catch (error) {
    console.log("console error: " + error);
  }
  
}

cardImagem(cardId: any){
  let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
  return urlimg;
}
  

isShowTooltip: boolean = false;
imgTooltip!: string;
topTp!: any
leftTp!: any

 //Serão enviadas para o tooltip
 cardImage!:string;
 card!:CardDTO;

mostrarDivCardsInfo(e: any, cardNumber:any): void {

  this.leftTp =  e.pageX - 700 + "px";
  this.topTp = + e.pageY - 100 + "px";
  this.isShowTooltip = true;

  this.cardImage = GeneralFunctions.cardImagem + cardNumber + '.jpg';
  this.cardService.findByNumero(cardNumber).subscribe(card => { this.card = card  });

}

esconderImgToolTip(){
  this.isShowTooltip = false;
}

addCardSideDeck(index:any){

  if(this.sideDeckCards.length >= 15){
    this.toastr.error("Side Deck already have 15 cards")
    return;
 }

 this.validAndAddCardRespectiveDeck(index, this.sideDeckCards,"Card added in Side Deck", null)
 if(this.sideDeckCards[0] != undefined && this.sideDeckCards[0].relDeckCards != undefined){
    this.sideDeckCards[0].relDeckCards[0].isSideDeck = true
 }
 
}

addCardExtraDeck(index:any){

  if(this.extraDeckCards.length >= 15){
    this.toastr.error("Extra Deck already have 15 cards, can't add more")
    return;
 }

 this.validAndAddCardRespectiveDeck(index, this.extraDeckCards, "Card added in Extra Deck", 'extra');
}

addCardMainDeck(index:any){

  if(this.mainDeckCards.length >= 60){
     this.toastr.error("Deck already have 60 cards")
     return;
  }

  this.validAndAddCardRespectiveDeck(index, this.mainDeckCards,"Card added in Main Deck", 'main');

}

validAndAddCardRespectiveDeck(index:any, arrayDeck:CardDTO[], messageToastr:string, typeDeck:string | null ){

  let isLimitOver:boolean = this.isCardLimitOver(this.arrayCards[index], arrayDeck)

  if(!isLimitOver){
    
    let card:CardDTO = this.arrayCards[index]
    card.relDeckCards = [];
    
    arrayDeck.unshift(card)
    this.toastr.success(messageToastr);
    this.verifyMapSearchedCards(card);

    if(typeDeck != null && typeDeck != undefined){
      this.countTypeCards(this.mainDeckCards, 'main');  
    } 
      
  } else {
    this.toastr.warning("There are already three copies of this card")
  }

}

verifyMapSearchedCards(card:CardDTO){
  
  let rel = this.mapSetCodes.get(card.numero);

  if(rel != null && rel != undefined){
      card.relDeckCards = rel;
  }
}

isCardLimitOver(cardAdded:any, array:CardDTO[]){

    let qtdCards = 0;
    let deckType = array
    
    for(let card of deckType){
      if(card.numero === cardAdded.numero)
        qtdCards++;
  }

   if(qtdCards >= 3) {return true} else {return false} 

}

removeFromArray(collection:CardDTO[], index:any, typeDeck:string){

  try{

    collection.splice(index,1);

    if(typeDeck != 'side'){
      this.countTypeCards(collection, typeDeck);
    }
    
    this.changePriceAndRarity(typeDeck,index,true, null)
    this.toastr.info("Card removed from Deck.");
    
  }catch(e){
     if(e instanceof Error){
      alert("Sorry, can't remove card. Try again later :( ")
     }  
  }

    this.calculateQtdRarity();
    this.recalculateDeckPrice();
}

totalDeckValue!:string

calculateDeckPrice(relDeckCards:any[]){
  let sum: number = 0;
  relDeckCards.forEach(card => sum += card.card_price);
  this.totalDeckValue = sum.toFixed(2)
}

 calculateQtdRarity(){
  this.rarities = {
    "Common": document.getElementsByClassName('Common').length,
    "Rare" : document.getElementsByClassName('Rare').length,
    "Super Rare": document.getElementsByClassName('Super Rare').length,
    "Ultra Rare" : document.getElementsByClassName('Ultra Rare').length
  }

  this.recalculateDeckPrice();
 } 

 recalculateDeckPrice(){
   
   let unitPrices = document.querySelectorAll<HTMLElement>('.price');
   let price:number = 0;
  
   for(var i = 0; i < unitPrices.length; i++){
     try{
        if(!isNaN(Number(unitPrices[i].title))){
         let val = Number(unitPrices[i].title);
         price += val;
        }

     }catch(e){
        console.log(e);
        alert("Error, can't calculate deck price :(" );
        return;
     }
   }

   this.totalDeckValue = price.toFixed(2);
 }

 criterias = new Array();
 openDialogSearch() {
  const dialogRef = this.dialog.open(SearchBoxComponent);

  dialogRef.afterClosed().subscribe(result => {
  
    if(result.data != null && result.data != undefined){
      this.arrayCards = [];
      this.page = 0;

      if(result.data.content.length > 0)
        this.validTypeDeckCard(result.data.content);
      else
        this.dialogUtils.showDialog("No Cards found in this consult", DialogTypeEnum.WARNING)

      this.criterias = result.criterias
    }
  }, error => {
      this.toastr.error("Sorry, something bad happened, try again later. ERROR " + error.status)
  });
}

getRequestParam(pageSize: number, page: number){
  let params = {page: page, size: pageSize }
  return params;
}

onScroll(){
  
  let div =  document.getElementById('cardsSearch');
  let scrollY= div?.scrollHeight! - div?.scrollTop!
  let height = div?.offsetHeight
  let offset = height! - scrollY;
  
  if (offset == 0 || ( offset > 0 && offset < 20)) {
    this.page = this.page + 1;
    const params = this.getRequestParam(this.pageSize, this.page)

    this.cardService.searchCardsDetailed(params, this.criterias).subscribe( newCards => {

      let arrCards:any = newCards.content;
     
      this.validTypeDeckCard(arrCards)
      

    }, error => {
      this.toastr.error("There was some error in consult cards. ERROR: " + error.status);
    })
}

}


consultCardSetCode(cardId:number){
    
  if(cardId == null || cardId == undefined){
    this.dialogUtils.showDialog("Sorry, can't consult card's set codes.", DialogTypeEnum.ERROR);
    return;
  }

  let isSeached = this.cardsSearched.includes(cardId,0);

  if(!isSeached){

    this.cardService.findAllRelDeckCardsByCardNumber(cardId).subscribe(data => {      
      let relationArray = data;
     
      this.updateCardSetCode(relationArray, cardId)
      this.cardsSearched.push(cardId);

    },
    error =>{
      console.log(error.body)
      this.dialogUtils.showDialog("ERROR: Something wrong happened, try again later.", DialogTypeEnum.ERROR)
    }) 

  } 
 
}


updateCardSetCode(relationArray: RelDeckCardsDTO[], cardNumber:any){

  let cardMainDeck:CardDTO[] = this.mainDeckCards.filter(card => card.id == cardNumber)
  let cardExtraDeck:CardDTO[] = this.extraDeckCards.filter(card => card.id == cardNumber);
  let cardSideDeck:CardDTO[] = this.sideDeckCards.filter(card => card.id == cardNumber);

  if(cardMainDeck != null && cardMainDeck != undefined)  
  this.updateCardSetCodeInSpecificDeck(relationArray, cardMainDeck, false);

  if(cardExtraDeck != null && cardExtraDeck != undefined)
    this.updateCardSetCodeInSpecificDeck(relationArray, cardExtraDeck, false); 

  if(cardSideDeck != null && cardSideDeck != undefined)
    this.updateCardSetCodeInSpecificDeck(relationArray, cardSideDeck,true); 

    if(!this.mapSetCodes.has(cardNumber)){
      this.mapSetCodes.set(cardNumber, relationArray);
      }
  
}

updateCardSetCodeInSpecificDeck(relationArray:RelDeckCardsDTO[], cards:CardDTO[], isSideDeck:boolean){

  cards.forEach(card => {
    card.relDeckCards = []
    relationArray.forEach(rel =>{
    rel.isSideDeck = isSideDeck;
    card.relDeckCards?.push(rel)
    })
  })
}
    

onChangeCardSetCode(cardSetCode:string, array:string, index: number){

  if(cardSetCode == "0"){
    this.changePriceAndRarity(array, index, true, null);
    this.calculateQtdRarity();
    return;
  }

 let typeArray = this.findTypeDeckArray(array)!;
 let card = typeArray[index];
 let relDeck = card['relDeckCards'];
 let rel:RelDeckCardsDTO = new RelDeckCardsDTO

 if(relDeck != undefined){
    rel =  relDeck.find(set => set.card_set_code == cardSetCode)!
 }

 this.changePriceAndRarity(array, index,false, rel);

 this.calculateQtdRarity();

 this.recalculateDeckPrice();

}

changePriceAndRarity(array:String, index:number, isSetCodeZero:boolean, rel:RelDeckCardsDTO | null){
  
  let priceId = array+"_"+index;
  let rarityId =  array+"_r_"+index;
  let rarityCountId = array+"_hidden_"+index;
  let priceHidden = array+"_hidden_price_"+index;

  let liPrice = document.getElementById(priceId);
  let liRarity = document.getElementById(rarityId);
  let hiddenInputRarity = document.getElementById(rarityCountId);
  let hiddenInputPrice = document.getElementById(priceHidden);

  if(isSetCodeZero && rel == null ){
    liPrice!.innerHTML ="$ 0.00";
    liPrice!.style.color = 'red';
    liRarity!.innerHTML = "-";
    hiddenInputRarity!.className = "-";
    hiddenInputPrice!.title = ""

  } else if(!isSetCodeZero && rel != null) {
    
      liPrice!.innerHTML="$ "+rel.card_price!.toFixed(2);
      liPrice!.style.color = '#228B22'
      liRarity!.innerHTML=rel.card_raridade;
      //liRarity.className = rel.card_raridade;
      hiddenInputRarity!.className = GeneralFunctions.rarity(rel.card_raridade)
      hiddenInputPrice!.title = rel.card_price!.toFixed(2);   
  }
     
}

findTypeDeckArray(array:string): CardDTO[] {

  if(array == 'main'){return this.mainDeckCards}
  else if (array == 'extra'){return this.extraDeckCards}
  else if(array == 'side'){return this.sideDeckCards}
  else {return []}

}

sendToSideDeck(deckType:string, index:number){
    let deck:CardDTO[] = this.findTypeDeckArray(deckType)!;
    let card:CardDTO = deck[index];

    deck.splice(index,1);
    this.sideDeckCards.unshift(card);
    this.countTypeCards(deck, deckType);

    this.toastr.success("Card sent to Side Deck!")
}

sendToMainDeck(index:number){
  let card = this.sideDeckCards[index];
  Object.assign(card, {isExtraDeck: null})

  let isExtraDeck = GeneralFunctions.isExtraDeckCard(card.genericType!);

  if(isExtraDeck){
    this.sideDeckCards.splice(index, 1);
    this.extraDeckCards.unshift(card);
    this.countTypeCards(this.extraDeckCards, 'extra');

    this.toastr.success("Card sent to Extra Deck");
  } else {
    this.sideDeckCards.splice(index, 1);
    this.mainDeckCards.unshift(card);
    this.countTypeCards(this.mainDeckCards, 'main');

    this.toastr.success("Card sent to Main Deck");
  }
}

relDeckCardsForSave:RelDeckCardsDTO[] = new Array();

@applyLoader()
saveDeck(){
  
  this.relDeckCardsForSave = [];

  let deckEdited:DeckDTO = new DeckDTO();

  deckEdited.id = this.deck.id;
  deckEdited.nome = this.deckNome.nativeElement.value.trim();
 
  if(deckEdited.nome == undefined || deckEdited.nome == ""){
    this.dialogUtils.showDialog("Invalid Deck Name!", DialogTypeEnum.ERROR);
    return;
  }

  deckEdited.setType = "DECK";
  
  let options = document.querySelectorAll('option:checked');

  this.insertInRelDeckCardForSave(this.mainDeckCards, 0, options, deckEdited.id, false);
  this.insertInRelDeckCardForSave(this.extraDeckCards, this.mainDeckCards.length, options, deckEdited.id, false);
  this.insertInRelDeckCardForSave(this.sideDeckCards, (this.mainDeckCards.length + this.extraDeckCards.length), options, deckEdited.id, true);

  deckEdited.rel_deck_cards = this.relDeckCardsForSave;
  console.log(JSON.stringify(deckEdited))
  this.deckService.saveUserDeck(deckEdited).subscribe(result => {

    if(result.status == 200)
      this.dialogUtils.showDialog("Deck was successfully saved!", DialogTypeEnum.SUCCESS)

  }, error =>{

    console.log(JSON.stringify(error, null));
    if(error.status != 200)
      this.dialogUtils.showDialog("Sorry, can't save deck now, try again later :(", DialogTypeEnum.ERROR)
      
  })
}

errorMsg!:string;
insertInRelDeckCardForSave(array:CardDTO[], indexSum:number, options:NodeListOf<Element>, deckId:number, isSideDeck:boolean){

  for(var i = 0; i < array.length; i++){ 
    let rel:RelDeckCardsDTO = new RelDeckCardsDTO() ;
    let setCode = options[i + indexSum].innerHTML

    if(!setCode.includes("SET CODE") && !setCode.includes(ECardRarities.NOT_DEFINED) && setCode != ""  && setCode != "undefined") {
        let relation:RelDeckCardsDTO = array[i].relDeckCards!.find(rel => rel.card_set_code === setCode.trim())!;
        rel.cardId = array[i].id 
        rel.quantity = 1

        this.relDeckCardsForSave.push(relation);

    } else {    

      let rel2: RelDeckCardsDTO = this.createRelUndefinied(array[i].numero, isSideDeck, false ,deckId,array[i].id!)
      this.relDeckCardsForSave.push(rel2);
      
      }      
  }
}

createRelUndefinied(cardNumber:number, isSideDeck:boolean, isSpeeduel:boolean, deckId:number, cardId:number): RelDeckCardsDTO {
      let  rel2:RelDeckCardsDTO = new RelDeckCardsDTO()
      rel2.cardNumber = cardNumber
      rel2.isSideDeck = isSideDeck
      rel2.isSpeedDuel = isSpeeduel
      rel2.deckId = deckId
      rel2.cardId = cardId
      rel2.dt_criacao = new Date();
      rel2.card_price = 0.0
      rel2.card_raridade = "undefined"
      rel2.cardSetCode = "undefined"
      rel2.setRarityCode = "undefined"
      rel2.rarityDetails = "undefined"
      rel2.quantity = 1
      return rel2;
}

rearrengeCards(){
  try{
    this.rearrangeMain();
    this.rearrangeExtra();
    this.rearrangeSide();

    this.toastr.success("The cards have been rearranged.")
  } catch(e){

    if(e instanceof Error){
     alert("Sorry, can't rearrange cards, something bad happened. Try again later :( ")
    }  
 }
   
}

rearrangeMain(){
  let auxArray:CardDTO[] = [];
 
  this.mainDeckCards.filter(card => card.genericType == GenericTypeCard.MONSTER).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.mainDeckCards.filter(card => card.genericType == GenericTypeCard.PENDULUM).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.mainDeckCards.filter(card => card.genericType == GenericTypeCard.SPELL).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.mainDeckCards.filter(card => card.genericType == GenericTypeCard.TRAP).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.mainDeckCards.filter(card => card.genericType == GenericTypeCard.TOKEN).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.mainDeckCards = [];
  this.mainDeckCards.push(...auxArray)
}

rearrangeExtra(){
  let auxArray:CardDTO[] = [];

  this.extraDeckCards.filter(card => card.genericType == GenericTypeCard.FUSION).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.extraDeckCards.filter(card => card.genericType == GenericTypeCard.LINK).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.extraDeckCards.filter(card => card.genericType == GenericTypeCard.SYNCHRO).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.extraDeckCards.filter(card => card.genericType == GenericTypeCard.XYZ).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));

  this.extraDeckCards = [];
  this.extraDeckCards.push(...auxArray)
}

rearrangeSide(){
  let auxArray:CardDTO[] = [];

  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.MONSTER).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.PENDULUM).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.SPELL).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.TRAP).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.TOKEN).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.FUSION).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.LINK).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.SYNCHRO).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));
  this.sideDeckCards.filter(card => card.genericType == GenericTypeCard.XYZ).sort((a,b) => a.nome!.localeCompare(b.nome!)).forEach(card => auxArray.push(card));

  this.sideDeckCards = [];
  this.sideDeckCards.push(...auxArray)
}
}
