import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit{

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  confirmationEmail:string = "";

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(param => {
      console.log(param['email'])
      this.confirmationEmail = param['email']
    })
  }

  return(){
    this.router.navigate(['/index'])
  }
}
