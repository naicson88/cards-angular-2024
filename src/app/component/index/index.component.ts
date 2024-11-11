import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [FooterComponent,RouterLink,RouterOutlet],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
