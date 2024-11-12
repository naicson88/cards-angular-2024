
import { MatDialog } from "@angular/material/dialog";
import { DialogTypeEnum } from "../enums/DialogTypeEnum";
import { DialogComponent } from "../component/dialog/dialog.component";


export class DialogUtils {
    constructor( private dialog: MatDialog){}

    public showDialog(message:string, type: DialogTypeEnum) {
        this.dialog.open(DialogComponent, {
            data: { message, type }
        })

        //AFTER CLOSE...
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