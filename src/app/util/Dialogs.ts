
import { WarningDialogComponent } from "../component/dialogs/warning-dialog/warning-dialog.component";
import { ErrorDialogComponent } from "../component/dialogs/error-dialog/error-dialog.component";
import { SuccessDialogComponent } from "../component/dialogs/success-dialog/success-dialog.component";
import { InfoDialogComponent } from "../component/dialogs/info-dialog/info-dialog/info-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { DialogTypeEnum } from "../enums/DialogTypeEnum";
import { DialogComponent } from "../component/dialog/dialog.component";


export class DialogUtils {
    constructor( private dialog: MatDialog){}

    public showDialog(message:string, type: DialogTypeEnum) {
        this.dialog.open(DialogComponent, {
            data: { message, type }
        })
    }

    // public  warningDialog(warningMessage:string){
    //     this.dialog.open(WarningDialogComponent, {
    //       data: warningMessage
    //     })
    //   }
    
    //   public  errorDialog(errorMessage:string){
    //     this.dialog.open(ErrorDialogComponent, {
    //       data: errorMessage
    //     })
    //   }

    //   public   successDialog(successMessage:string){
    //     this.dialog.open(SuccessDialogComponent,{
    //       data: successMessage
    //     })
    //   }

    //  public infoDialog(infoMessage:string){
    //     this.dialog.open(InfoDialogComponent, {
    //       data: infoMessage
    //     })
    //   }
}