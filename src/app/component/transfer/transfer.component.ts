import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TransferService } from '../../service/transfer.service';
import { SpinnerService } from '../../util/Spinner';
import { ToastrService } from 'ngx-toastr';
import { UserSetCollectionDTO } from '../../classes/UserSetCollectionDTO';
import { DialogUtils } from '../../util/Dialogs';
import { applyLoader } from '../../util/Decorators';
import { DialogTypeEnum } from '../../enums/DialogTypeEnum';
import { CardSetCollectionDTO } from '../../classes/CardSetCollectionDTO';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { RouterLink } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [ 
    MatButtonModule,
    RouterLink,
    MatFormField,
    MatFormFieldModule,
    MatLabel,
    MatOption,
    MatSelectModule,
    CurrencyPipe,
    FormsModule
    
  ],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent {
  constructor(
    private service: TransferService,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private toastr: ToastrService
  ) {
    this.dialogUtils = new DialogUtils(this.dialog);
  }

  topTp!: any;
  leftTp!: any;
  imgTooltip!: string;
  isShowTooltip: boolean = false;
  isVisible = false;

  showLeftDetails = false;
  showRightDetails = false;

  rightSets: any[] = [];
  leftSets: any[] = [];

  leftUserSetCollecton!: UserSetCollectionDTO;
  rightUserSetCollection!: UserSetCollectionDTO;

  dialogUtils!: DialogUtils

  ngOnInit() {}

  @applyLoader()
  searchSets(setType: string, side: string) {
    if (setType == "Deck") {
      this.service.getDecksNames().subscribe(
        (names) => {
          if (side == "R") this.rightSets = names;
          else this.leftSets = names;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.service.getSetCollectionNames(setType).subscribe((names) => {
        if (side == "R") this.rightSets = names;
        else this.leftSets = names;
      });
    }
  }

  getSetAndCards(side: string, setType: string, id: number) {
    if (this.isSetChoosenValid(id, side, setType)) {
      let setId = Number(id);
      if (setType == "Deck") {
        this.getDeckAndCardsForTransfer(side, setId, setType);
      } else {
        this.getSetCollectionForTransfer(side, setId, setType);
      }
    }
  }
  @applyLoader()
  getDeckAndCardsForTransfer(side: string, deckId: number, setType: string) {
    this.service.getDeckAndCardsForTransfer(deckId).subscribe(
      (data) => {
        if (side == "L") {
          this.leftUserSetCollecton = data;
          this.leftUserSetCollecton.setType = setType;
        } else {
          this.rightUserSetCollection = data;
          this.rightUserSetCollection.setType = setType;
        }
      },
      (error) => {
        this.dialogUtils.showDialog("Sorry, something wrong happened! Try again later", DialogTypeEnum.ERROR);
        console.log(error);
      }
    );
  }

  @applyLoader()
  getSetCollectionForTransfer(side: string, deckId: number, setType: string) {
    this.service.getSetCollectionForTransfer(deckId).subscribe(
      (data) => {
        console.log(data);
        if (side == "L") {
          this.leftUserSetCollecton = data;
          this.leftUserSetCollecton.setType = setType;
        } else {
          this.rightUserSetCollection = data;
          this.rightUserSetCollection.setType = setType;
        }
      },
      (error) => {
        this.dialogUtils.showDialog("Sorry, something wrong happened! Try again later", DialogTypeEnum.ERROR);
        console.log(error);
      }
    );
  }

  isSetChoosenValid(setId: number, side: string, setType: string): boolean {
    if (
      this.rightUserSetCollection == undefined &&
      this.leftUserSetCollecton == undefined
    ) {
      return true;
    } else if (
      (this.rightUserSetCollection == undefined ||
        this.rightUserSetCollection.id != setId) &&
      (this.leftUserSetCollecton == undefined ||
        this.leftUserSetCollecton.id != setId)
    ) {
      return true;
    } else {
      this.dialogUtils.showDialog("This set has already been choose!", DialogTypeEnum.ERROR);
      return false;
    }
  }

  transferCardToOtherSide(side: string, cardSetCode: string) {
    let card: CardSetCollectionDTO =
      side == "R"
        ? this.getCardBySide(this.rightUserSetCollection, cardSetCode)
        : this.getCardBySide(this.leftUserSetCollecton, cardSetCode);
    if (
      (side == "R" && this.leftUserSetCollecton == undefined) ||
      (side == "L" && this.rightUserSetCollection == undefined)
    ) {
      this.dialogUtils.showDialog("First, choose the Set of other side", DialogTypeEnum.ERROR);
      return;
    }

    if (side == "R") this.transferCardToLeft(card);
    else this.transferCardToRight(card);
  }

  private validQtdCardsDeck(userSet: UserSetCollectionDTO, cardId: number) {
    if (userSet.setType == "Deck") {
      let qtd = userSet.cards.filter((c) => c.cardId == cardId).length;
      if (qtd == 3) {
        this.toastr.warning("There are already 3 of this Card in Deck");
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  private spliceOrSubtractCard(
    userSet: UserSetCollectionDTO,
    card: CardSetCollectionDTO
  ) {
    let qtdRight = card.quantityUserHave;
    if (userSet.setType == "Deck") {
      let index: number = userSet.cards.findIndex(
        (c) => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code
      );
      userSet.cards.splice(index, 1);
    } else {
      userSet.cards
        .filter(
          (c) => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code
        )
        .forEach((cardFiltered) => {
          cardFiltered.quantityUserHave--;
          if (cardFiltered.quantityUserHave == 0) {
            userSet.cards.splice(
              userSet.cards.findIndex(
                (c) =>
                  c.relDeckCards.card_set_code ==
                  card.relDeckCards.card_set_code
              ),
              1
            );
          }
        });
    }
  }

  private tranferCardAndCalculate(
    userSet: UserSetCollectionDTO,
    card: CardSetCollectionDTO
  ) {
    let transferableCard: CardSetCollectionDTO[] = userSet.cards.filter(
      (c) => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code
    );

    if (
      transferableCard != null &&
      transferableCard != undefined &&
      transferableCard.length > 0 &&
      userSet.setType != "Deck"
    ) {
      transferableCard[0].quantityUserHave++;
    } else {
      let newCard = Object.assign({}, card);
      newCard.angularId = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      newCard.quantityUserHave = 1;
      userSet.cards.unshift(newCard);
      //this.leftUserSetCollecton.cards.filter(c => c.angularId == )
    }
  }

  transferCardToLeft(card: CardSetCollectionDTO) {
    if (!this.validQtdCardsDeck(this.leftUserSetCollecton, card.cardId))
      return;

    this.spliceOrSubtractCard(this.rightUserSetCollection, card);
    this.tranferCardAndCalculate(this.leftUserSetCollecton, card);

    let leftTotalPrice = parseFloat(this.leftUserSetCollecton.totalPrice);
    let rightTotalPrice = parseFloat(this.rightUserSetCollection.totalPrice);

    this.leftUserSetCollecton.totalPrice = (
      card.relDeckCards!.card_price! + leftTotalPrice
    )
      .toFixed(2)
      .toString();
    this.rightUserSetCollection.totalPrice = (
      rightTotalPrice - card.relDeckCards.card_price!
    )
      .toFixed(2)
      .toString();
  }

  transferCardToRight(card: CardSetCollectionDTO) {
    if (!this.validQtdCardsDeck(this.rightUserSetCollection, card.cardId))
      return;

    this.spliceOrSubtractCard(this.leftUserSetCollecton, card);

    this.tranferCardAndCalculate(this.rightUserSetCollection, card);

    let leftTotalPrice = parseFloat(this.leftUserSetCollecton.totalPrice);
    let rightTotalPrice = parseFloat(this.rightUserSetCollection.totalPrice);

    this.leftUserSetCollecton.totalPrice = (
      leftTotalPrice - card.relDeckCards.card_price!
    )
      .toFixed(2)
      .toString();
    this.rightUserSetCollection.totalPrice = (
      rightTotalPrice + card.relDeckCards.card_price!
    )
      .toFixed(2)
      .toString();
  }

  getCardBySide(
    deck: UserSetCollectionDTO,
    setCode: string
  ): CardSetCollectionDTO {
    let card = deck.cards.filter(
      (c) => c.relDeckCards.card_set_code == setCode
    )[0];
    return card;
  }
  @applyLoader()
  saveSets() {
    let setsToBeSaved: UserSetCollectionDTO[] = new Array();

    setsToBeSaved.push(this.rightUserSetCollection);
    setsToBeSaved.push(this.leftUserSetCollecton);

    this.service.saveSets(setsToBeSaved).subscribe(
      (result) => {
        let msg = result;
        this.dialogUtils.showDialog(msg, DialogTypeEnum.SUCCESS);
      },
      (error) => {
        this.dialogUtils.showDialog("Sorry, something bad happened! Try again later", DialogTypeEnum.ERROR);
        console.log(error);
      }
    );
  }

  cardImagem(cardId: any) {
    let urlimg = GeneralFunctions.cardImagem + cardId + ".jpg";
    return urlimg;
  }

  storedCardId(cardNumber: any) {
    localStorage.setItem("idCard", cardNumber);
  }
}
