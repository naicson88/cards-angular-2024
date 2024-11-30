import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';

//import * as ClassicEditor from '../../../../../ckeditor5/build/ckeditor';

@Component({
  selector: 'app-ckeditor',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule ],
  templateUrl: './ckeditor.component.html',
  styleUrl: './ckeditor.component.css'
})
export class CkeditorComponent {
data: any;
   //@Input() myEditor: any;

   constructor() { }

   public Editor: any = ClassicEditor  
 
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
