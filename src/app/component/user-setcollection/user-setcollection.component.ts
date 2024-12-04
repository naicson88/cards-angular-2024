import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from '../../util/Spinner';
import { CardService } from '../../service/card.service';
import { ToastrService } from 'ngx-toastr';
import { UserSetCollectionDTO } from '../../classes/UserSetCollectionDTO';
import { CardSetCollectionDTO } from '../../classes/CardSetCollectionDTO';
import { CardDTO } from '../../classes/CardDTO';
import { DialogUtils } from '../../util/Dialogs';
import { applyLoader } from '../../util/Decorators';
import { DialogTypeEnum } from '../../enums/DialogTypeEnum';
import { UserSetcollectionService } from '../../service/user-setcollection.service';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { RelDeckCardsDTO } from '../../classes/RelDeckCardsDTO';
import { Router, RouterLink } from '@angular/router';
import { ChangeArtComponent } from '../shared/change-art/change-art.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'
import { FormsModule } from '@angular/forms';
import { QuantityRaritiesComponent } from '../shared/quantity-rarities/quantity-rarities.component';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-user-setcollection',
  standalone: true,
  imports: [RouterLink, CommonModule, QuantityRaritiesComponent,
    FormsModule,
    MatButtonModule,
    MatFormField,
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckbox,
    MatSelect,
    MatOption,
  ],
  templateUrl: './user-setcollection.component.html',
  styleUrl: './user-setcollection.component.css'
})
export class UserSetcollectionComponent {

  @ViewChild("IDontHave",{static: true}) elemento!: MatCheckbox;
  @ViewChild("IHave",{static: true}) elementoHave!: MatCheckbox;
  @ViewChild("nameInput",{static: true}) nameInput! : ElementRef;
  @ViewChild('callAPIDialog',{static: true}) callAPIDialog!: TemplateRef<any>;
  private dialogRef!: MatDialogRef<TemplateRef<any>>;

  
  constructor(private service: UserSetcollectionService, private dialog: MatDialog,
     private toast: ToastrService, private cardService: CardService, private route: Router ) 
     {
      this.dialogUtils = new DialogUtils(this.dialog);
     }

  userSetCollecton!: UserSetCollectionDTO; 
  originalCollection: Array<CardSetCollectionDTO> = []
  onlyUserHaveCollection!: CardSetCollectionDTO[];
  filteredCollection: CardSetCollectionDTO[] = [];
  basedDecks: any[] = [];

  isChecked = false;
  isCheckedDont = true


  cardsSearched: CardDTO[] = [];

  isVisible: boolean = true;
  showDetail = true;

  rarities = {}
  konamiRarities = {}

  isNewCollection = false;

  dialogUtils!: DialogUtils

  ngOnInit() {
    this.getSetCollection();
  }


  //SWIPER
  breakpoints = {
    320:{slidePerView: 1.6, spaceBetween: 20}
  };
  @applyLoader()
  newSetCollection(){
    this.dialogUtils.showDialog('Create your new Collection!', DialogTypeEnum.INFO);
    this.userSetCollecton = new UserSetCollectionDTO();
    this.userSetCollecton.cards = new Array();
    this.userSetCollecton.id = 0;
    this.userSetCollecton.name = "";
    this.userSetCollecton.totalPrice = "0";
    this.originalCollection = this.userSetCollecton.cards.slice(0); 

    this.isNewCollection = true;
  }
  @applyLoader()
  getSetCollection(){
    const id = sessionStorage.getItem("idDeckDetails");
    
    if(id == "0"){
      this.newSetCollection();
      this.rarities = {'Common': null}
      return;
     }

    this.service.getSetCollection(Number(id)).subscribe(
      {
        next: (data: any) => {

          this.userSetCollecton = data;
          this.setBasedDeck(data['basedDeck'])
          this.rarities = data['konamiRarities']
          this.originalCollection = this.userSetCollecton.cards.slice(0);;
     
          this.putAngularId(this.originalCollection )
        }, error: (error) => {
        console.log(error);
        this.dialogUtils.showDialog("It was not possible load this Set Collection, try again later!", DialogTypeEnum.ERROR);
      }
    })
  }

  putAngularId(arr:CardSetCollectionDTO[]){
    for(let i = 0; i < this.originalCollection.length; i++){
      arr[i].angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
  }

  keyPressQuantityCard(event: any){
    var charCode =  event.keyCode;

    if((charCode < 48 || charCode > 57)){
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  //Checkbox Methods
  filterOnlyCardsUserHave(event:any, haveOrNot:string){
    let userHave = haveOrNot === 'have' ? true : false;

    if(event === true){

      this.userSetCollecton.cards = [];
      this.filteredCollection = [];

      this.originalCollection.forEach(card => {
          if(userHave){
            if(card.quantityUserHave > 0){
              this.filteredCollection.push(card);
            }
          } else {
            if(card.quantityUserHave === 0){
              this.filteredCollection.push(card);
            }
          }        
      });

      this.userSetCollecton.cards = this.filteredCollection;
    } else {
      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = this.originalCollection;
      this.filteredCollection = [];
    }
    
  }

  filterByRarity(){
      let filteredArray = new Array();

      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Secret Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Ultra Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Super Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Common').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Not Defined').forEach(card => { filteredArray.push(card)});

      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = filteredArray;
  }

  filterByCardSetCode(e:any){
    
    let setCode = e.value;

    this.elemento.checked = false;//.checked = false;
    this.elementoHave.checked = false;

    if(setCode == 0){
      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = this.originalCollection;
    }
       

    else {
      
      this.filteredCollection = [];

      this.originalCollection.forEach(card => {
          if(card.relDeckCards.cardSetCode!.includes(setCode))
            this.filteredCollection.push(card);
      });

      if(this.filteredCollection.length > 0)
        this.userSetCollecton.cards = this.filteredCollection;
    }   
  }

  filterCollection(e:any){
    
    let filter = e.value;

    if(filter == 0){
      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = this.originalCollection;
      return;
    }

    if(filter == 1)
      this.filterByAZ();
    else if(filter == 2)
        this.filterByMostAdded();
    else if(filter == 3)
        this.filterByPrice();
    else if(filter == 4)
        this.filterByRarity();  
   else if( filter == 5)
        this.filterByAZSetCode(); 
     
  }

  filterByPrice() {
    var sortedArray = this.userSetCollecton.cards.slice(0);
    sortedArray.sort(function(a,b) {
        return a.relDeckCards.card_price! - b.relDeckCards.card_price!
    });

    this.userSetCollecton.cards = [];
    this.userSetCollecton.cards = sortedArray;
    this.userSetCollecton.cards.reverse()
  }

  filterByMostAdded() {

    var sortedArray = this.userSetCollecton.cards.slice(0);
    sortedArray.sort(function(a,b) {
        return a.quantityUserHave - b.quantityUserHave;
    });

    this.userSetCollecton.cards = [];
    this.userSetCollecton.cards = sortedArray;
    this.userSetCollecton.cards.reverse()
  }

  filterByAZ(){
      var sortedArray: CardSetCollectionDTO[] = this.userSetCollecton.cards.slice(0);
      sortedArray.sort((n1,n2) => {
        if (n1.name > n2.name) {
            return 1;
        }
    
        if (n1.name < n2.name) {
            return -1;
        }
    
        return 0;
    })

    this.userSetCollecton.cards = [];
    this.userSetCollecton.cards = sortedArray;
  }

  filterByAZSetCode(){
    var sortedArray: CardSetCollectionDTO[] = this.userSetCollecton.cards.slice(0);
    sortedArray.sort((n1,n2) => {
      if (n1.relDeckCards.card_set_code! > n2.relDeckCards.card_set_code!) {
          return 1;
      }
  
      if (n1.relDeckCards.card_set_code! < n2.relDeckCards.card_set_code!) {
          return -1;
      }
  
      return 0;
  })

  this.userSetCollecton.cards = [];
  this.userSetCollecton.cards = sortedArray;
  }


  searchInput!: string;

  searchCard(e:any){
    
    let value = this.searchInput.toLowerCase();

    if(value.length > 1){
      this.userSetCollecton.cards = [];
      this.originalCollection.forEach(card => {     
        if(card.name.toLowerCase().includes(value)){
          this.userSetCollecton.cards.push(card);
        } else if (card.relDeckCards.card_set_code!.toLowerCase().includes(value)){
          this.userSetCollecton.cards.push(card)
        }
      })
    } else {
        if(this.userSetCollecton.cards.length < this.originalCollection.length)
          this.userSetCollecton.cards = this.originalCollection;
    }
  }
  
  addOrRemoveCard(card: CardSetCollectionDTO, operation:string){  
     
   let totalPrice = parseFloat(this.userSetCollecton.totalPrice);
    card.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    this.originalCollection.filter(c1 => c1.angularId == card.angularId).forEach(cardFiltered => {
      if(operation == 'plus'){
        cardFiltered.quantityUserHave += 1;
        this.userSetCollecton.totalPrice = ((cardFiltered.relDeckCards.card_price! + totalPrice).toFixed(2)).toString();
      } else if(operation == 'minus' && card.quantityUserHave > 0){
        cardFiltered.quantityUserHave -= 1;
        this.userSetCollecton.totalPrice = ((totalPrice - cardFiltered.relDeckCards.card_price!).toFixed(2)).toString();
      }
    });    
  }

  addPlusOneForall(){
    this.originalCollection.forEach(card => {
      card.quantityUserHave += 1;
    })

    this.toast.success("Plus 1 was added to all Cards!");
  }

  showDetails(event:any){
    if(event)
      this.isVisible = true;
    else
      this.isVisible = false;
  }


  cardImagem(cardId: any){
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

  
 criterias = new Array();
 @applyLoader()
 openDialogSearch() {
    const dialogRef = this.dialog.open(SearchBoxComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result.data != null && result.data != undefined && result.data.content.length > 0){
       console.log(result.data)
        this.cardsSearched = result.data.content;
      }

      else{
        this.dialogUtils.showDialog("No Cards found!", DialogTypeEnum.WARNING)
      }
        this.criterias = result.criterias
    }, error => {
        this.toast.error("Sorry, something bad happened, try again later.")
    });
}

  closeSearch(){
    this.cardsSearched = [];
  }

  addToCollection(card:CardDTO){
      
    let newcard:CardSetCollectionDTO = new CardSetCollectionDTO();
    let rel: RelDeckCardsDTO = new RelDeckCardsDTO();

    newcard.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    newcard.cardId = card.id!;
    newcard.name = card.nome!
    newcard.number = card.numero
    newcard.quantityOtherCollections = 0;
    newcard.quantityUserHave = 0;
    newcard.searchedRelDeckCards = [];

    rel.card_raridade = "Not Defined";
    rel.card_set_code = "";
    rel.card_price = 0

    newcard.relDeckCards = rel;
    if(this.userSetCollecton.id > 0){
      this.originalCollection.unshift(newcard);

     this.userSetCollecton.cards = this.originalCollection;
    }
    else{
      this.userSetCollecton.cards.push(newcard);
      this.originalCollection = this.userSetCollecton.cards
    }
     

  }


  storedCardId(cardNumber: number){    
    localStorage.setItem("idCard", String(cardNumber));
  }

  @applyLoader()
  consultCardSetCode(card:any){
    
    if(card.cardId == null || card.cardId == undefined){
      this.dialogUtils.showDialog("Sorry, can't consult card's set codes.", DialogTypeEnum.ERROR);
      return;
    }
    
    if(card.searchedRelDeckCards.length == 0){
  
      this.cardService.findAllRelDeckCardsByCardNumber(card.cardId).subscribe(data => {     
        let relationArray: RelDeckCardsDTO[] = data;
        card.listSetCode = [];
        relationArray.forEach(rel => {
          if(!card.listSetCode.includes(rel.card_set_code))
              card.listSetCode.push(rel.card_set_code);
        });
        card.searchedRelDeckCards = relationArray;
        card.quantityOtherCollections = 0;
      },
      error =>{
        console.log(error.body)
        this.dialogUtils.showDialog("ERROR: Something wrong happened, try again later.", DialogTypeEnum.ERROR)
      });
    } 
   
  }

  setRelInfo(card:CardSetCollectionDTO, setCode: string){
    card.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

    this.originalCollection.filter(c => c.angularId == card.angularId).forEach(c => {
        let rel:RelDeckCardsDTO = c.searchedRelDeckCards.filter(r => r.card_set_code === setCode)[0];

        if(rel != null && rel != undefined && setCode != "undefined"){
            c.relDeckCards.card_price = rel.card_price;
            c.relDeckCards.card_raridade = rel.card_raridade;
            c.relDeckCards.card_set_code = rel.card_set_code;
            c.quantityOtherCollections = card.quantityOtherCollections
        } else if (setCode == "undefined"){
            c.relDeckCards.card_price = 0
            c.relDeckCards.card_raridade = "Not Defined"
            c.relDeckCards.card_set_code = "";
            c.quantityOtherCollections = 0
        }
    })
    //console.log(this.originalCollection);   
  }

  @applyLoader()
  saveSetCollection(){
    this.closeSearch();

    let collectionName = this.nameInput.nativeElement.value;

    if(collectionName == "" || collectionName == null){
      this.dialogUtils.showDialog("Please, fill the Collection's Name!", DialogTypeEnum.WARNING);
      this.nameInput.nativeElement.focus();
      return;
    }

    this.userSetCollecton.cards = [];
 
    this.setCardsToBeSaved()
      
    this.userSetCollecton.name = collectionName
    console.log(this.userSetCollecton)
      this.service.saveSetCollection(this.userSetCollecton).subscribe(data => {
        this.userSetCollecton.cards = this.originalCollection;
        this.dialogUtils.showDialog("Set Collection was successfully saved!", DialogTypeEnum.SUCCESS);
      }, error => {
        console.log(error);
        this.dialogUtils.showDialog("Sorry, It was not possible save Collection, try again later!", DialogTypeEnum.ERROR);
      })
  }

  setRarityColor(rarity:string){
    return GeneralFunctions.colorRarity(rarity);
  }

  setCardsToBeSaved(){
      this.originalCollection.filter(coll => coll.quantityUserHave > 0).forEach(coll => {
          if(coll.relDeckCards.card_set_code!.includes("Set Code"))
              coll.relDeckCards.card_set_code = "Not Defined"          

           this.userSetCollecton.cards.push(coll);
      }) 

      //console.log(this.userSetCollecton.cards)
  }

  openDialog(){
    this.dialogRef = this.dialog.open(this.callAPIDialog);
  }

  closeDialog(){
    this.dialogRef.close();
  }
  
  setBasedDeck(basedDecks: any) {
    if(basedDecks != null || basedDecks != undefined){
      Object.entries(basedDecks).forEach(item => {
        this.basedDecks.push({
          "deckId": item[0],
          "deckName": item[1]
        });
      })

      console.log(this.basedDecks)
    }  
  }

  createBasedDeck(deckId:any){
    if(!deckId)
      return;

    this.service.createBasedDeck(Number(deckId)).subscribe(result => {
      this.closeDialog();
      this.dialogUtils.showDialog("A Based Deck has been created!", DialogTypeEnum.SUCCESS)
      // localStorage.setItem("idDeckDetails", result);
      // localStorage.setItem("source", "KONAMI");
      // localStorage.setItem("set_type", "DECK");
      GeneralFunctions.saveDeckInfoLocalStorage(result, "KONAMI", "DECK");
      this.route.navigate(['/userdeck-details/', '']);

    }, error => {
      console.log(error);
    })

  }
  
  openDialogArt(cardId:number, angularId:string): void {
    console.log(cardId)
    const dialogRef = this.dialog.open(ChangeArtComponent, {
        data: {cardId: cardId},
      });

    dialogRef.afterClosed().subscribe(result => {
          if(result)
            this.originalCollection.find(card => card.angularId == angularId)!.number = result
          
          console.log(this.originalCollection)
      });
    }

}
