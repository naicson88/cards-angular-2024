import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quantity-rarities',
  standalone: true,
  imports: [],
  templateUrl: './quantity-rarities.component.html',
  styleUrl: './quantity-rarities.component.css'
})
export class QuantityRaritiesComponent {
  @Input() rarities!:{}

  raritiesName:string[] = [];
  raritiesQuantity:string[] = [];

  mapRarity = new Map<string, string>([
      ['Common', 'table-primary'],
      ['Rare', 'table-info'],
      ['Super Rare', 'table-success'],
      ['Ultra Rare', 'table-warning'],
      ['Secret Rare', 'table-danger'],
      ['Ultimate Rare', 'table-success'],
      ['Gold Rare', 'table-info'],
      ['Parallel Rare', 'table-success'],
      ['Ghost Rare', 'table-warning'],
  ]);

  constructor() { }

  ngOnInit() {
     
  }

  ngOnChanges(): void {
    this.getEntries(this.rarities)
  }

  getEntries(obj: object) {
      if(obj != undefined){
        this.raritiesName = Object.keys(obj)
        this.raritiesQuantity = Object.values(obj)
      }   
  }

  getRarityClass(rarity:string) {
      return this.mapRarity.get(rarity);
  }

}
