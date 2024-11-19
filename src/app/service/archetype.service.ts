import { Injectable } from '@angular/core';
import { ArchetypeDTO } from '../component/archetype/archetype.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArchetypeService {

  archetype!: ArchetypeDTO;
  archetypeId!: number;
  
  constructor(private http: HttpClient ) {}

  base_url = environment.devCardsMain

 public getArchetypeId(){
   return this.archetypeId;
 }

  public getAllArchetypes(){
    return  this.http.get<ArchetypeDTO[]>(this.base_url+"/arch/all");
  }

  public getArchetype(id:any){
    return this.http.get<ArchetypeDTO[]>(this.base_url+`/arch/archetype/${id}`);
  }
}
