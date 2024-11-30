import { CardDTO } from "./CardDTO";
import { RelDeckCardsDTO } from "./RelDeckCardsDTO";
import { SetCollectionDTO } from "./SetCollectionDTO";

export class DeckDTO {
    id!: number;
    imagem?: string;
    nome!: string
    nomePortugues?: string
    cards?: CardDTO[];
    isKonamiDeck?:string;
    lancamento?:Date;
    setType!:string;
    rel_deck_cards?:RelDeckCardsDTO[]
    setCollection?: SetCollectionDTO[]
    imgurUrl?:string;
    isSpeedDuel?:boolean;
    quantityUserHave!: number
}