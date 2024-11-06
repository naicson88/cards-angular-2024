
import { FooterComponent } from '../../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/authentication/auth-service';
import { SpinnerService } from '../../../util/Spinner';
import { GeneralFunctions } from '../../../util/GeneralFunctions';
import { DialogUtils } from 'src/app/Util/DialogUtils';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, MatCardModule, MatDialog],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  form!: FormGroup
  formResend!: FormGroup;
  private formSubmitAttempt! :any

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private spinner: SpinnerService,
    private dialog: MatDialog

  ) { }

  resend:string = "";
  isLogin: boolean = false;
  isResend: boolean = false;
  dialogUtils = new DialogUtils(this.dialog);  

  ngOnInit() {

    this.checkFormType();

    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.formResend = this.fb.group({
      emailResend: ['', Validators.required],
    });

  }

  checkFormType(){
    let url = window.location.href;

    if(url.includes("resend"))
      this.isResend = true;
    else
      this.isLogin = true;
  }

  get f() { return this.form.controls }

  get fr(){return this.formResend.controls}

  isFieldInvalid(field: string) {
    this.verifyBadRequest();
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (!this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  @applyLoader()
  onSubmit() {
    
    const loginRequest: LoginRequestDTO = {
      username: this.f.userName.value,
      password: this.f.password.value
    };

    this.authService.login(loginRequest).subscribe(user => {
      this.router.navigate([this.authService.INITIAL_PATH]);
    }, error => {
        if(error.error.msg == "Bad credentials"){
          this.dialogUtils.errorDialog("Invalid Username / Password");
        } else {
          this.dialogUtils.errorDialog("Something bad happened, try again later!")
        }
    }); 

  }

  verifyBadRequest() {
 
    let url = window.location.href;

    if (url.includes('/login;data=true')) {
      this.badRequest = true;
    }
  }

  clean()
  {
    this.badRequest = false;
  }

  return(){
    this.router.navigate(['/index'])
  }

  @applyLoader()
  resendPassword(){

    let email = this.fr.emailResend.value

    if(!GeneralFunctions.validateEmail(email)){
      this.dialogUtils.errorDialog("Please inform a valid Email!")
      return false;
    }

    if(email){

      this.authService.resendPassword(email).subscribe(response => {
       console.log(response)
        this.dialogUtils.successDialog("Email sent to " + email + ", access to change your password!");
        this.return()
      }, error => {
       
        this.dialogUtils.errorDialog(error.error.msg)   
      })
    }
    else {
      this.dialogUtils.errorDialog("Please fill a valid email!");
    }
  }

  openRegister(){
    this.router.navigate(['/register'])
  }

  getAddress() {
    if(sessionStorage.getItem("Address") === null){
      this.authService.getIpAddress().subscribe(addr => {
        console.log(addr)
        GeneralFunctions.storeDataLocalStorage(new Map<string,string>([['Address', addr]]))
      })
    }
  }

}


export class LoginRequestDTO {
  username: string = ""
  password: string = "";
}