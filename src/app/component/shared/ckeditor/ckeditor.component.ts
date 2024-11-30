import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as ClassicEditor from '../../../../../ckeditor5/build/ckeditor.js';
//import * as ClassicEditor from '../../../../../ckeditor5/build/ckeditor';

@Component({
  selector: 'app-ckeditor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ckeditor.component.html',
  styleUrl: './ckeditor.component.css'
})
export class CkeditorComponent {
   //@Input() myEditor: any;

   constructor() { }

   public Editor = ClassicEditor  
 
   ngOnInit() {
     
   }
 
   getData(element:any):string {
     let data = element.data
     return data;
   }
 
   setData(element:any):string {
     console.log(element.data)
     return "teste"
   }
}
