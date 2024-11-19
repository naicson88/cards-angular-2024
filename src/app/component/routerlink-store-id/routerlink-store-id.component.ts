import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routerlink-store-id',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './routerlink-store-id.component.html',
  styleUrl: './routerlink-store-id.component.css'
})
export class RouterlinkStoreIdComponent {
  constructor() { }

  @Input() path?:string
  @Input() complement?:string
  @Input() id?:string
  @Input() key?:string
  @Input() text?:string

  ngOnInit() {
  }

  storedCardId() {
    if(this.key && this.id)
      localStorage.setItem(this.key, this.id);
  }

}
