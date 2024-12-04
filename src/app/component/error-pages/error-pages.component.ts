import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/authentication/auth-service';

@Component({
  selector: 'app-error-pages',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-pages.component.html',
  styleUrl: './error-pages.component.css'
})
export class ErrorPagesComponent {
  @ViewChild('img',{static: false})img!:HTMLElement;

  constructor(private router: ActivatedRoute, private authService: AuthService, private r: Router) { }

  ngAfterViewChecked(): void {
   
  }

  errorImage!:string;
  isLoggedIn!:boolean;

  ngOnInit() {
    
    this.verifyUser()
    this.loadErrorImage()
  }

  scroll(){
   window.scrollTo(0,250)
  }

  loadErrorImage(){
    
      let event = this.router.snapshot.paramMap.get('code');
   
        if(event === '500'){
          this.errorImage = '..//..//..//assets//img//error//500.jpg';
          return;
        } 
        else if(event === '404'){
          this.errorImage = '..//..//..//assets//img//error//404.PNG'
          return;

        } else {
          this.errorImage = '..//..//..//assets//img//error//500.jpg';
          return;
        }

  }

  verifyUser(){       
    this.authService.isLoggedIn()!.subscribe(result => {
     this.isLoggedIn = result;
      if(!this.isLoggedIn)
        this.r.navigate(["/index"])
    })
  }

}
