import { Component } from '@angular/core';
import { applyLoader } from '../../util/Decorators';
import { Router } from '@angular/router';
import { ArchetypeService } from '../../service/archetype.service';
import { RouterlinkStoreIdComponent } from '../shared/routerlink-store-id/routerlink-store-id.component';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-archetype',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './archetype.component.html',
  styleUrl: './archetype.component.css'
})
export class ArchetypeComponent {
  constructor(private router: Router, private service: ArchetypeService ) { }

  ngOnInit() {
    this.loadAllArchetypes();
  }

  archetype: ArchetypeDTO[] = [];
  newArchMap: any

  @applyLoader()
  loadAllArchetypes(){
    this.service.getAllArchetypes().subscribe({
      next: (data) => {
        this.newArchMap = data;
        console.log(this.newArchMap)
        },
        error: (error) => {
          console.log(error)
        }
      })
  }

// private  tranformMapInArray(originalMap: object){  
//     Object.entries(originalMap).forEach((arc) => {
//       this.newArchArray.push({
//         letter: arc[0],
//         archetypes: arc[1],
//     });

//   return this.newArchArray;
// })
// }

  goToLetter(ele:string){
  
    var elemento = document.getElementById(ele);
    if(elemento){
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline : "nearest"
      })
      elemento.style.color = 'red'
    }
  }

  
  storedArchetype(id: string){     
   // const id = event.target.id;
     localStorage.setItem("idArchetype", id);
  }
}

export class ArchetypeDTO {
  id?:number;
  arcName?: string;
  arrayCards?: [];
  arrayDecks?: [];	 
  
}
