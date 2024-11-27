import { CardDetailsDTO } from "./CardDetailsDTO";
import { RelDeckCardsDTO } from "./RelDeckCardsDTO";

export class InsideDeckDTO {
    insideDeckName?: string;
    insideDeckImage?: string;
    cards?: CardDetailsDTO[];
    relDeckCards?: RelDeckCardsDTO[];
}