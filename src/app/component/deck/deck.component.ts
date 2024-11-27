import { Component } from '@angular/core';
import { DialogUtils } from '../../util/Dialogs';
import { DeckService } from '../../service/deck.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../util/Spinner';
import { DeckDTO } from '../../classes/DeckDTO';
import { applyLoader } from '../../util/Decorators';
import { DialogTypeEnum } from '../../enums/DialogTypeEnum';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { MatAutocomplete, MatOption } from '@angular/material/autocomplete';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [MatAutocomplete, MatOption, RouterLink],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css'
})
export class DeckComponent {
    
  constructor(private service: DeckService, private domSanitizer: DomSanitizer, private  router: Router, public dialog: MatDialog,
    private toastr: ToastrService, private  spinner: SpinnerService, private route: ActivatedRoute) 
    { 
      this.dialogUtils = new DialogUtils(this.dialog);  
    }
    
  dialogUtils!: DialogUtils
  page: number = 1; 
  pageSize: number = 25
  pageSizes = [25,50,75,100];
  totalItens = 0;
  set_type!: string;
  source!: string
  deck!: DeckDTO[]
  relUserDeck!: any[];
  safeUrl!: SafeUrl;
  arrayAutocomplete: any[] = [];
  filteredAutocomplete!: any[];
  user: any;
  imgPath!: string;

 
   ngOnInit() {
     
     this.route.data.subscribe(set_type =>{
       this.set_type = set_type['set_type'];
     })
 
     this.route.data.subscribe(source =>{
       this.source = source['source'];
     })
 
 
     this.getDecksInfo();
     this.autocompleteSets(this.source);
 
   }
 
   deckDetailPage(nome:any){
     if(nome != null ){
       this.router.navigate(['deck-details', nome]);
     }
   }
   
   @applyLoader()
   getDecksInfo(): void {
       const params = this.getRequestParam(this.pageSize, this.page);
   
       this.service.getDecks(params, this.set_type, this.source).subscribe({
          next:(data) => {
                     
            const {content, totalElements} = data;
            //console.log(data);
            this.deck = content;
        
            this.totalItens = totalElements;
      
            for(let i = 0; i < this.deck.length; i++){
              //Angular apresentava como se o link da imagem fosse unsafe/perigoso
              let img = this.deck[i].imagem
              if(img != undefined){
                  this.safeUrl = this.domSanitizer.bypassSecurityTrustUrl(img);  
              }
             
        }
          },

          error: (error) => {
            console.log(error)
          }
       },
      )

   }
 
   autocompleteSets(source:string){
     this.service.autcompleteSets(source).subscribe(data => {
       this.arrayAutocomplete = data;
       //console.log(JSON.stringify(this.arrayAutocomplete));
     })
   }
 
   getRequestParam(pageSize:any, page:any){
      let params = {page: 0, size: 0 }
    
      if (page) {
        params[`page`] = page - 1;
      }
    
      if (pageSize) {
        params[`size`] = pageSize;
      }
    
      return params;
 
   }
     removeSetToUserCollection(event:any) : any {
       
       let qtdCardManeged:number;
       let setId = event.target.id
       let i = this.deck.findIndex(deck => deck.id == setId);
 
       let conf= confirm("Are you sure you want to delete from your collection?")
 
       if(conf){
 
         if(this.set_type == 'DECK'){
           this.service.removeDeckToUsersCollection(setId).subscribe(data => {
             qtdCardManeged = data;   
               this.toastr.warning('The Deck has been removed from your collection! Plus ' + qtdCardManeged + ' cards of this deck.', 'Success!');
          
           }, error => {
             console.log(error)
             this.dialogUtils.showDialog("Sorry, something bad happened.", DialogTypeEnum.ERROR)
            
           })
         } else {
           this.service.removeSetToUsersCollection(setId).subscribe(data => {
               
             qtdCardManeged = data;    
               this.toastr.warning('Set has been removed from your collection!', 'Warning!');
             
           }, error => {
             console.log(error)
             this.dialogUtils.showDialog("Sorry, something bad happened.", DialogTypeEnum.ERROR)
            
           })
         }
 
         this.deck.splice(i, 1);
 
       } else {
           return false;
       }
     }
 
   ordenacaoArrayAPI(){
     this.deck.sort(function(a: any,b: any){
       return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;  
     })
   }
 
   handlePageSizeChange(event: any): void {
 
     this.pageSize = event//event.value;
     this.page = 1;
     this.getDecksInfo();
   }
 
   handlePageChange(event: any) {
       this.page = event;
       this.getDecksInfo();
    
   }
 
   storeDeckId(id:any, setType:string) {
     setType =  setType != 'DECK' ? 'COLLECTION' : 'DECK'
     GeneralFunctions.saveDeckInfoLocalStorage(id, this.source, setType);
   }
   
   addDeckToCollection(e: any){
     const deckId = e.target.name;
     
     //console.log(deckId, this.user)
    this.toastr.success('The Deck has been added to your collection!', 'Success!')
   }
 
   setName:string = '';
   searchByName(){
 
     this.service.searchBySetName(this.setName, this.source).subscribe( data => {
         
         let decksFound:any[] = [];
         const {content, totalElements} = data;
 
         decksFound = content;
 
         if(decksFound == null || decksFound == undefined || decksFound.length == 0){
             if(this.source == 'KONAMI')
               this.toastr.warning("No Set found with this name")
             else
               this.toastr.warning("No Set found with this name in yout collection")
         } else {
           this.deck = [];
           this.deck = decksFound;
           this.toastr.success(this.deck.length + " Set(s) found")
         }
       
     })
 
   }
 
   getSetTypeValue(setType:string) : any{
 
     if(setType == null || setType == undefined){
       this.dialogUtils.showDialog("Sorry, it was not possible consult itens.", DialogTypeEnum.ERROR);
       return false;
     }
 
     this.set_type = setType;
     this.deck = [];
     this.totalItens = 0;
 
     this.getDecksInfo();
      
   }
 
    _filter(value:string): any{
    
        if(value.length >= 3){
          const filterValue = this._normalizeValue(value);    
          this.filteredAutocomplete = this.arrayAutocomplete.filter(set => this._normalizeValue(set.setName).includes(filterValue)) ;
          return this.filteredAutocomplete  
          }
        }
    
      private _normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
      }
    
   
 }