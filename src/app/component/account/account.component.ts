import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/authentication/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../service/account.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';

import { FooterComponent } from '../footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterLink, MatAutocompleteModule, MatIconModule, MatMenuModule, ReactiveFormsModule, MatFormFieldModule, FooterComponent, MatInputModule, MatButton ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  constructor( private toastr: ToastrService, private service: AccountService, private router: Router, private authService: AuthService,) { }

  formCliente!: FormGroup;

  isSuccessPage = false;

  isPasswordOk = false;
  showWrongPassword = false;

  ngOnInit() {
    this.createForm(new ManageAccount())
  }

  createForm(acc: ManageAccount){
    this.formCliente = new FormGroup({
      username: new FormControl(acc.username),
      pass: new FormControl(acc.pass),
      newpass: new FormControl(acc.newpass),
      email: new FormControl(acc.email),
      newemail: new FormControl(acc.newemail),
    })
  }

  saveAccount() {
 //     console.log(JSON.stringify(this.formCliente.value))
      this.validFields(this.formCliente.value);

      this.service.changeAccountInformation(this.formCliente.value).subscribe(data => {
          console.log(data);          
          this.router.navigate(['account-manager'],  { queryParams: { success: 'true' }})
      })
  }

  validFields(obj:any) {
      if(!!obj.pass || !!obj.newpass) {
        if(obj.pass.length < 6){ 
          this.toastr.error("Password must have at least 6 characteres"); 
          return false
        }
        else if(obj.pass != obj.newpass){
          this.toastr.error("Different password value!");
          return false
        }
      }

      if(!!obj.email || !!obj.newemail)
          if(obj.email != obj.newemail){
            this.toastr.error("Different Email value!"); 
            return false
          }

      if(obj.username.length < 6){
        this.toastr.error("Username too small! Must have at least 6 characteres"); 
        return false
      }
      return true;
   }

   confirmPassword(pass:string){
      this.authService.confirmPassword(pass).subscribe(data => {   
          console.log(data)   
          if(data === 'Correct!'){    
            this.isPasswordOk = true;
          }        
      }, error => {
        console.log(error)
         this.showWrongPassword = true;
      })
   }

   setWrong(){
    this.showWrongPassword = false
   }
}

export class ManageAccount {
    username!: string;
    pass!: string;
    newpass!: string;
    email!:string;
    newemail!:string
}

