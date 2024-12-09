import { CardsOfUserSetsDTO } from "./CardsOfUserSetsDTO";

export class CardOfUserDetailDTO {
    cardNumber!: number;
	cardImage!:string;
	cardName!:string;
	rarity!: Map<string, string>;
	setsWithThisCard!: CardsOfUserSetsDTO[]
	setsUserDontHave!: CardsOfUserSetsDTO[];
}