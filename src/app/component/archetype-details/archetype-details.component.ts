import { Component } from '@angular/core';
import { ArchetypeService } from '../../service/archetype.service';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { applyLoader } from '../../util/Decorators';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-archetype-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './archetype-details.component.html',
  styleUrl: './archetype-details.component.css'
})
export class ArchetypeDetailsComponent {
  archetype!: ArchetypeDTO;
  total : number = 0;
  mainTitle:string = "Cards related to this archetype"

  constructor(private archService: ArchetypeService) {
   
  }
  

  ngOnInit() {
    this.loadArchetypeDetails();
  }

  storedCardId(id: any){
    localStorage.setItem("idCard", id); 
  }

  cardImagem(cardId: any){
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

  @applyLoader()
  loadArchetypeDetails(){
    const id = localStorage.getItem("idArchetype");
    this.archService.getArchetype(id).subscribe({    
      next: (data) => {      
        this.archetype = data;
        
        if(this.archetype.arrayCards != undefined){
          this.total = this.archetype.arrayCards.length
        }
      }
    })
  }
  

   isShowTooltip: boolean = false;
    imgTooltip!: string;
    topTp!: any;
    leftTp!: any;
 
    mostrarImgToolTip(e: any){
        this.leftTp =  e.pageX + 15 + "px";
        this.topTp = + e.pageY + 15 + "px";
   
        //this.imgTooltip = img; se necessario coloca mais um argumento, o caminho da imagem
        this.imgTooltip = e.target.src;
        this.isShowTooltip = true;
     }
   
     esconderImgToolTip(){
      this.isShowTooltip = false;
    }
}

export class ArchetypeDTO {
  id?:number;
  arcName?: string;
  arrayCards?: any[];
  arrayDecks?: any[];	 
  
}