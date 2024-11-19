
import { FooterComponent } from '../../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/authentication/auth-service';
import { SpinnerService } from '../../../util/Spinner';
import { GeneralFunctions } from '../../../util/GeneralFunctions';

import { Component, inject, OnInit } from '@angular/core';
import { DialogUtils } from '../../../util/Dialogs';
import { applyLoader } from '../../../util/Decorators';
import {  AUTH_STRATEGY, AuthModule } from '../../../service/authentication/auth-strategy';
import { MatDialog } from '@angular/material/dialog';
import { DialogTypeEnum } from '../../../enums/DialogTypeEnum';
import { DialogComponent } from '../../dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SessionAuthStrategy } from '../../../service/authentication/strategy -auth-session';
import { JwtAuthStrategy } from '../../../service/authentication/strategy-auth-jwt';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, MatCardModule, ReactiveFormsModule, AuthModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  // providers:[
  //   {
  //     provide: AUTH_STRATEGY,
  //     useFactory: (http: HttpClient) => {
  //       switch (environment.authStrategy) {
  //         case 'session':
  //           return new SessionAuthStrategy(http);
  //         case 'token':
  //           return new JwtAuthStrategy();
  //         default:
  //           throw new Error('Auth strategy not supported');
  //       }
  //     },
  //     deps: [HttpClient],
  //   },
  // ]
})
export class LoginComponent implements OnInit {
  
  form!: FormGroup
  formResend!: FormGroup;
  private formSubmitAttempt! :any

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: SpinnerService,
    private dialog: MatDialog

  ) {
    this.dialogUtils = new DialogUtils(this.dialog)
   }

  resend:string = "";
  isLogin: boolean = false;
  isResend: boolean = false;
  dialogUtils!: DialogUtils
  badRequest!: boolean;


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
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (!this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }

  readonly dialog2 = inject(MatDialog);
  @applyLoader()
  onSubmit() {
    
    const loginRequest: LoginRequestDTO = {
      username: this.f?.['userName'].value,
      password: this.f?.['password'].value
    };

    console.log(loginRequest)

    this.authService.login(loginRequest).subscribe({

      next: (user) => {
        localStorage.setItem("username", user.username)
        this.router.navigate([this.authService.INITIAL_PATH]);
      },
      error: (error) =>{
        console.log(error)
        if(error.error.msg == "Bad credentials") {
            this.dialogUtils.showDialog("Invalid Username / Password", DialogTypeEnum.ERROR)
        } else {
            this.dialog2.open(DialogComponent, {
              data: {message: "Something bad happened, try again later!", type: DialogTypeEnum.ERROR}
            })
          }
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
  resendPassword() :any {
    let email = this.fr?.['emailResend'].value

    if(!GeneralFunctions.validateEmail(email)){
      this.dialogUtils.showDialog("Please inform a valid Email!", DialogTypeEnum.ERROR)
      return false;
    }

    if(email){

      this.authService.resendPassword(email).subscribe(response => {
       console.log(response)
        this.dialogUtils.showDialog("Email sent to " + email + ", access to change your password!", DialogTypeEnum.SUCCESS);
        this.return()
      }, error => {
       
        this.dialogUtils.showDialog(error.error.msg, DialogTypeEnum.ERROR)   
      })
    }
    else {
      this.dialogUtils.showDialog("Please fill a valid email!", DialogTypeEnum.ERROR);
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
