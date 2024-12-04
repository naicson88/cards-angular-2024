import { Component, Input } from '@angular/core';
import { DeckService } from '../../../service/deck.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-to-collection',
  standalone: true,
  imports: [],
  templateUrl: './add-to-collection.component.html',
  styleUrl: './add-to-collection.component.css'
})
export class AddToCollectionComponent {
  @Input() deckID!:number
  @Input() quantityUserHave!:number
  @Input() set_type!:string

  constructor(private service: DeckService, private toastr: ToastrService) { }

  ngOnInit() {
  }


  addSetToUserCollection() {
    let qtdCardManeged:number;
    let setId = this.deckID

    if(this.set_type == 'DECK'){       

      this.service.addDeckToUsersCollection(setId).subscribe({
        next: (data) => {
          qtdCardManeged = data;

          if(qtdCardManeged == 0)
            return;
  
          if(qtdCardManeged > 0){
            this.toastr.success('The Set has been added to your collection! Plus', 'Success!');
              
            this.manegeQuantity(setId, "A");
        }

        } , error: (error) => {
          console.log(error)
          this.toastr.error('Unable to add the Deck or Cards to the user.', 'Error!')
        }

      })

    } else {
      
      this.service.addSetToUsersCollection(setId).subscribe({
          next: (data) => {
            this.toastr.success("The Set has been added to your collection! Plus all it's cards", 'Success!');
            
              this.manegeQuantity(setId, "A");
          },
          error: (error) => {
            console.log(error)
             this.toastr.error('Something bad happened, try again later.', 'Error!')
          }
        })
      }
    
    }

  manegeQuantity(deckId:number, flagAddOrRemove:string){
  
    let id = "inp_"+deckId;
    let el =(<HTMLInputElement>document.getElementById(id));
    let valor = el.value;
    if(valor != null){
      let parsed = parseInt(valor);
      
      if(flagAddOrRemove == 'A'){
        parsed += 1;
      } else if (flagAddOrRemove == 'R' && parsed > 0){
        parsed -= 1;
      } else {
        
        return ;
      }      
      
      if(!Number.isNaN(parsed) && parsed != undefined){
        (<HTMLInputElement>document.getElementById(id)).value = parsed.toString();
      
      }    
    }  
  }
}
