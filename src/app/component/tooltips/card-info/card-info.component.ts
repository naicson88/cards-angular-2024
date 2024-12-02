import { Component, Input } from '@angular/core';
import { CardDTO } from '../../../classes/CardDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.css'
})
export class CardInfoComponent {
  @Input() cardImage!: string
  @Input() card!:CardDTO

  constructor() { }
  
  //msg:string

  ngOnInit() {
    
  }
}
