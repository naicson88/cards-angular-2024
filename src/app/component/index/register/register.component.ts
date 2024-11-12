import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserDTO } from '../../../service/authentication/auth-service';
import { applyLoader } from '../../../util/Decorators';
import { DialogUtils } from '../../../util/Dialogs';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../../../util/Spinner';
import { DialogTypeEnum } from '../../../enums/DialogTypeEnum';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  form!: FormGroup;
  formChange!: FormGroup
  token:string = "";
  user: UserDTO = new UserDTO();
  formSubmitAttempt: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: SpinnerService

    
  ) {    this.dialogUtils = new DialogUtils(this.dialog); }

  isRegiter: boolean = false;
  isChangePassword = false;
  dialogUtils!: DialogUtils


  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.formChange = this.fb.group({
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    });

    this.checkFormType();
  }

  checkFormType(){
    let url = window.location.href;

    if(url.includes("change-password"))
      this.validTokenForChangePassword();
    else
      this.isRegiter = true;
  }

  get f() {
    return this.form.controls
  }

  get fc(){
    return this.formChange.controls
  }

  isFieldInvalid(field: string){
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (!this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }

  creatreUserDTO(): UserDTO {
    this.user.email = this.f?.['email'].value,
    this.user.password = this.f?.['password'].value,
    this.user.username = this.f?.['username'].value
    return this.user
  }

  @applyLoader()
  register() : any{
    
    let validFields:string = this.validFields();
    if(validFields != ""){
      alert(validFields) 
      return false;
    }

    this.authService.signup(
      this.creatreUserDTO()
    ).subscribe({
        next: (user) => {
          this.router.navigate(['confirm-email'], {queryParams: {email: this.f?.['email'].value}})
        },
        error: (error) => {
            this.dialogUtils.showDialog(error.error.msg, DialogTypeEnum.ERROR)
        }
      }
    )
  }

  validFields():string{
    if(this.f?.['username'].value == "" || this.f?.['username'].value.length < 3){
      return 'User Name too short!';
    }

    if(this.f?.['password'].value == "" || this.f?.['password'].value.length < 6){
      return 'Password too short!';
    }

    if(this.f?.['email'].value == "" || this.f?.['password'].value.length < 6){
      return 'Invalid Email';
    }

    if(this.f?.['password'].value != this.f?.['confirm'].value){
      return 'Password not match confirmation!';
    }

    return "";

  }

  validTokenForChangePassword(){
    this.activeRoute.queryParams.subscribe(param => {
      this.token = param?.['token'];
    });
    
    this.authService.validTokenToChangePassword(this.token).subscribe(response => {
        this.isChangePassword = true;
        this.user = response;
    }, error => {
      this.dialogUtils.showDialog(error.error.msg, DialogTypeEnum.ERROR)
    })
  }

  changePassword() : any{
    
    let pass = this.fc?.['password'].value
    let con = this.fc?.['confirm'].value

    if(pass == "" || pass.length < 6){
      return 'Password too short!';
    }

    if(pass != con){
      this.dialogUtils.showDialog("Password dont match  confirmation!", DialogTypeEnum.ERROR)
      return false;
    }

    this.user.password = pass;

    this.authService.changePassword(this.user).subscribe(response => {
      this.dialogUtils.showDialog("Password has been changed successfully!", DialogTypeEnum.SUCCESS)
      this.router.navigate(['/login'])
    } , error => {
      this.dialogUtils.showDialog(error.error.msg, DialogTypeEnum.ERROR)
    })
  }

  return(){
    this.router.navigate(['/index'])
  }
}
