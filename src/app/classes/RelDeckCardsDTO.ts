export class RelDeckCardsDTO {
    id?:number;
    deckId?: number;
    card_set_code?:string;
    card_price?:number;
    card_raridade!:string;
    isSideDeck?: boolean;
    cardNumber?: number;
    cardId?: number
    isSpeedDuel?: boolean
    dt_criacao?: Date

    total?: number;
    common?: number;
    rare?: number;
    superRare?: number
    ultaRare?: number
    numero?: number;
    quantity?:number;
    setRarityCode?:string;
    rarityDetails?:string;
    cardSetCode?: string
}