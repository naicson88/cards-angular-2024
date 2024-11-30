import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SetDetailsDTO } from '../../classes/SetDetailsDTO';
import { InsideDeckDTO } from '../../classes/InsideDeckDTO';
import { Paths } from '../../enums/Paths';
import { GeneralFunctions } from '../../util/GeneralFunctions';
import { DeckService } from '../../service/deck.service';
import { CardService } from '../../service/card.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpinnerService } from '../../util/Spinner';
import { applyLoader } from '../../util/Decorators';
import { AddToCollectionComponent } from '../shared/add-to-collection/add-to-collection.component';
import { RouterlinkStoreIdComponent } from '../shared/routerlink-store-id/routerlink-store-id.component';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { QuantityRaritiesComponent } from '../shared/quantity-rarities/quantity-rarities.component';
import { PriceUpdateComponent } from '../shared/price-update/price-update.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-deck-detail',
  standalone: true,
  imports: [AddToCollectionComponent, RouterLink, RouterlinkStoreIdComponent, CommonModule, PageHeaderComponent, QuantityRaritiesComponent, PriceUpdateComponent,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule, 
  ],
  templateUrl: './deck-detail.component.html',
  styleUrl: './deck-detail.component.css'
})
export class DeckDetailComponent implements OnInit {
  @ViewChild("attrCanvas", { static: true }) elemento!: ElementRef;
  @ViewChild("divCardDetails", { static: true }) divCardDetails!: ElementRef;

  deckDetails!: SetDetailsDTO;
  arrInsideDecksCards: InsideDeckDTO[] = [];
  typeSearch: string = "SET";

  infoGeralAtk = [];
  infoGeralDef = [];
  cardsValiosos = [];
  categoriaCards = [];
  countsGeneric_type: any;

  rarities = {};

  topTp: any;
  leftTp: any;
  imgTooltip!: string;
  isShowTooltip: boolean = false;
  isVisible = false;

  source!: string | null;
  set_type!: string;

  imgPath!: string;
  mainTitle = "Deck's Details";
  sessionKey = 'idCard'

  paths = Paths
  concatString = GeneralFunctions.concateString

  constructor(
    private service: DeckService,
    private cardService: CardService,
    private activaeRoute: ActivatedRoute,
    private spinner: SpinnerService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.activaeRoute.data.subscribe((source: any) => {
      this.source = source.source;
      this.set_type = source.set_type;
    });

    window.scrollTo(0, 0);
    //this.checkPreviousUrl();
    this.loadDeckDetails();
  }

  //Carrega informações do deck
  @applyLoader()
  loadDeckDetails() {
    const id = sessionStorage.getItem("idDeckDetails");
    const source = sessionStorage.getItem("source") || "";
    const set_type = sessionStorage.getItem("set_type") || "";
    this.source = source;
    this.service.getDeckDetails(id, source, set_type).subscribe(
      {
        next: (data: any) => {
          this.deckDetails = data;
          this.arrInsideDecksCards = data["insideDeck"] || [];
          this.imgPath = this.deckDetails.imgurUrl || "";
  
          if (this.arrInsideDecksCards[0].cards != undefined && this.arrInsideDecksCards[0].cards.length > 0) {
            this.isVisible = true;
            this, (this.rarities = data["quantity"]);
          }
        }, error: (error) => {
            console.log("#getDeckDetails")
            console.log(error)
        }
      }
    );
  }


  cardImagem(cardId: any) {
    let urlimg = GeneralFunctions.cardImagem + cardId + ".jpg";
    return urlimg;
  }

  //Setar cor de fundo do Atk e do Def
  setColor(vlr: number) {
    if (vlr >= 0 && vlr <= 1900) return "rgba(0, 255, 0, 0.2)";
    else if (vlr > 1900 && vlr <= 2400) return "rgba(255, 255, 0, 0.3)";
    else return "rgba(255, 64, 0, 0.3)";
  }

  setColorAtkDef(vlr: number | undefined) {
    if(vlr == undefined)
      return 0;

    if (vlr >= 0 && vlr <= 1900) return "green";
    else if (vlr > 1900 && vlr <= 2400) return "GoldenRod";
    else return "firebrick";
  }

  setRarityColor(rarity: string | undefined) {
    if(rarity == undefined)
      return "silver";
    return GeneralFunctions.colorRarity(rarity);
  }

  setAttColor(att: string) {
    return GeneralFunctions.colorAttribute(att);
  }

  hasProp(obj: Object, name: string) : any{
    if (obj != undefined && obj != null) {
      return obj.hasOwnProperty(name);
    } else {
      console.log("Error hasProp")
    }
  }

  mostrarImgToolTip(img: string, e: any) {
    this.leftTp = e.pageX + 15 + "px";
    this.topTp = +e.pageY + 15 + "px";

    //this.imgTooltip = img;
    this.imgTooltip = e.target.src;
    this.isShowTooltip = true;
  }

  esconderImgToolTip() {
    this.isShowTooltip = false;
  }

  storedCardId(event: any) {
    localStorage.setItem("idCard", event.target.name);
  }

  storeDeckId(id: any) {
    GeneralFunctions.saveDeckInfoLocalStorage(id, this.source || "", this.set_type);
  }

  atributoImagem(atributo: string): any {
    let attr = atributo != null ? atributo.toUpperCase() : "";

    switch (attr) {
      case "CONTINUOUS":
        return "..\\..\\assets\\img\\outras\\Continuous.png";
      case "FIELD":
        return "..\\..\\assets\\img\\outras\\Field.png";
      case "QUICK-PLAY":
        return "..\\..\\assets\\img\\outras\\Quick.png";
      case "QUICK_PLAY":
        return "..\\..\\assets\\img\\outras\\Quick.png";
      case "COUNTER":
        return "..\\..\\assets\\img\\outras\\Counter.png";
      case "EQUIP":
        return "..\\..\\assets\\img\\outras\\Equip.jpg";
      default:
        "";
    }
  }

  tipoImagem(tipo: string): any {
    switch (tipo) {
      case "Aqua":
        return "..\\..\\assets\\img\\tiposMonstros\\Aqua.png";
      case "Beast":
        return "..\\..\\assets\\img\\tiposMonstros\\Beast-DG.png";
      case "Beast-Warrior":
        return "..\\..\\assets\\img\\tiposMonstros\\Beast-Warrior-DG.png";
      //  case 'Creator-God'  : return '..\\..\\assets\\img\\tiposMonstros\\Beast-Warrior-DG.png';
      case "Cyberse":
        return "..\\..\\assets\\img\\tiposMonstros\\Cyberse.PNG";
      case "Dinosaur":
        return "..\\..\\assets\\img\\tiposMonstros\\Dinosaur-DG.png";
      case "Divine-Beast":
        return "..\\..\\assets\\img\\tiposMonstros\\Divine-Beast-DG.png";
      case "Dragon":
        return "..\\..\\assets\\img\\tiposMonstros\\Dragon-DG.png";
      case "Fairy":
        return "..\\..\\assets\\img\\tiposMonstros\\Fairy-DG.png";
      case "Fiend":
        return "..\\..\\assets\\img\\tiposMonstros\\Fiend-DG.png";
      case "Fish":
        return "..\\..\\assets\\img\\tiposMonstros\\Fish-DG.png";
      case "Insect":
        return "..\\..\\assets\\img\\tiposMonstros\\Insect-DG.png";
      case "Machine":
        return "..\\..\\assets\\img\\tiposMonstros\\Machine-DG.png";
      case "Plant":
        return "..\\..\\assets\\img\\tiposMonstros\\Plant-DG.png";
      case "Psychic":
        return "..\\..\\assets\\img\\tiposMonstros\\Psychic-DG.png";
      case "Pyro":
        return "..\\..\\assets\\img\\tiposMonstros\\Pyro-DG.png";
      case "Reptile":
        return "..\\..\\assets\\img\\tiposMonstros\\Reptile-DG.png";
      case "Rock":
        return "..\\..\\assets\\img\\tiposMonstros\\Rock-DG.png";
      case "Sea Serpent":
        return "..\\..\\assets\\img\\tiposMonstros\\Sea_Serpent-DG.png";
      case "Spellcaster":
        return "..\\..\\assets\\img\\tiposMonstros\\Spellcaster-DG.png";
      case "Thunder":
        return "..\\..\\assets\\img\\tiposMonstros\\Thunder-DG.png";
      case "Warrior":
        return "..\\..\\assets\\img\\tiposMonstros\\Warrior-DG.png";
      case "Winged Beast":
        return "..\\..\\assets\\img\\tiposMonstros\\Winged_Beast-DG.png";
      case "Wyrm":
        return "..\\..\\assets\\img\\tiposMonstros\\Wyrm-DG.png";
      case "Zombie":
        return "..\\..\\assets\\img\\tiposMonstros\\Zombie-DG.png";
    }
  }

  openDashboardPage() {
    const id = sessionStorage.getItem("idDeckDetails");
    const source = sessionStorage.getItem("source");
    const set_type = sessionStorage.getItem("set_type");

    const name = this.deckDetails.nome;

    window.open(
      `/dashboard/${name}?id=${id}&source=${source}&setType=${set_type}`,
      "_blank"
    );
  }

}
