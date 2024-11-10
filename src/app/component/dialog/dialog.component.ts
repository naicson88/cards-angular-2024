import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogTypeEnum } from '../../enums/DialogTypeEnum';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {

  description: string = ''
  color: string = ''
  iconClass: string = ''

  dialogChoosen?: DialogObject;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, type: DialogTypeEnum })  { }

  ngOnInit(): void {
    let dialogMap = new Map<DialogTypeEnum, DialogObject> ();
    dialogMap.set(DialogTypeEnum.ERROR, new DialogObject('Error', 'rgb(248, 32, 32)', 'fas fa-exclamation-circle'))
    dialogMap.set(DialogTypeEnum.INFO, new DialogObject('Info', '#0d9bb1', 'fas fa-exclamation-circle'))
    dialogMap.set(DialogTypeEnum.SUCCESS, new DialogObject('Success', 'green', 'fas fa-check-circle'))
    dialogMap.set(DialogTypeEnum.WARNING, new DialogObject('Warning', 'goldenrod', 'fas fa-exclamation-triangle'))

    this.dialogChoosen = dialogMap.get(this.data.type)
  }

}

export class DialogObject {
  constructor(
    public description: string, 
    public color: string, 
    public iconClass: string
  ){}
}

