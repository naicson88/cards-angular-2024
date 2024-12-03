import { RelDeckCardsDTO } from "./RelDeckCardsDTO";

export class CardSetCollectionDTO {
    angularId!: string
    cardId!:number;
    number!:number;
    name!:string;
    quantityUserHave!:number;
    quantityOtherCollections!:number;
    relDeckCards!: RelDeckCardsDTO;
    searchedRelDeckCards!: any[];
    listSetCode!:string[]
    isSpeedDuel!:boolean
}