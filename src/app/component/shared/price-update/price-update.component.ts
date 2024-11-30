import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../util/Spinner';
import { AuthService } from '../../../service/authentication/auth-service';
import { applyLoader } from '../../../util/Decorators';
import { PriceUpdateService } from '../../../service/price-update.service';
import { GeneralFunctions } from '../../../util/GeneralFunctions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-update',
  standalone: true,
  imports: [],
  templateUrl: './price-update.component.html',
  styleUrl: './price-update.component.css'
})
export class PriceUpdateComponent {
  @Input() name!:string;
  @Input() typeSearch!:string;
  constructor(public service: PriceUpdateService,  private toastr: ToastrService, public spinner: SpinnerService, public authService: AuthService, private router: Router ) { }


  isAdmin: boolean = false;

  ngOnInit() {
    // this.user.getCurrentUser$().subscribe({
    //   next: (data) =>{
    //     if(data != undefined){
    //       if(data['sub'] === environment.userAdmin)
    //         this.isAdmin = true;
    //     }
    //   }
    // })

      GeneralFunctions.getCurrentUser(this.authService, this.router)?.subscribe({
          next: (isAdmin: boolean) => {
            this.isAdmin = isAdmin
          },
          error: (err) => {
            console.error('-> Erro ao validar o usuário:', err);
            this.isAdmin = false; 
          }
      })
    
  }

  getPrice(): any{
     if(this.name == undefined || this.name == null){
       this.toastr.error("Invalid Set Name!")
       return false;
     }
     if(this.typeSearch == "SET")
        this.getSetPrice()
  }

  @applyLoader()
  getSetPrice() {
    this.spinner.show()
    this.service.updateSetPrice(this.name).subscribe( {
       next: (resp) => {
        console.log(resp);
        this.toastr.success("Sent to the queue successfully!")
        this.spinner.hide()
       },
       error: (error) => {
        this.toastr.error(error);
        this.spinner.hide()
       }
    })
  }
}
