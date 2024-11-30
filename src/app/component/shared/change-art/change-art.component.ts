import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeArtService } from '../../../service/change-art.service';
import { GeneralFunctions } from '../../../util/GeneralFunctions';

@Component({
  selector: 'app-change-art',
  standalone: true,
  imports: [],
  templateUrl: './change-art.component.html',
  styleUrl: './change-art.component.css'
})
export class ChangeArtComponent {
  constructor(public dialogRef: MatDialogRef<ChangeArtComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: ChangeArtService) { }

  alternativesArts:number [] = [];

  ngOnInit() {
    this.getCardAlternativeArts()
  }

  getCardAlternativeArts(){
      this.service.getAlternativeNumbers(this.data.cardId).subscribe(result => {
          this.alternativesArts = result
      })
  }

  selectedCard:number = 0;

  onNoClick(): void {
    this.dialogRef.close();
  }

  cardSelected(id:number){
    this.selectedCard = id
  }

  cardChoosen() {
     this.dialogRef.close(this.selectedCard);     
  }

  cardImagem(cardId: any){
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }
} 

export interface DialogData{
  cardId:number
}
