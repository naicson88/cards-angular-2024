import { DeckDTO } from "./DeckDTO";
import { RelDeckCardsDTO } from "./RelDeckCardsDTO";

export class CardDTO {
	 angularId?:string;
     id?:number;
	 numero!: number;
	 categoria?: string;
	 nome?: string;
	 nomePortugues?:string
	 atributo?:any
	 propriedade?:string
     nivel?:number;
	 tipo!: TipoDTO
	 atk?:number;
	 def?:number;
	 condicao?:string;
	 descricao?:string
	 descricaoPortugues?:string
	 imagem?:string
	 raridade!:string
	 escala?:number;
	 descr_pendulum?:string
	 descr_pendulum_pt?:string
	 arquetipo?:[]
	 qtd_link?:string
	 genericType?:string
	 set_decks?: DeckDTO[];
	 attributeImg?:any;
	 isExtraDeck?:boolean;
	 price?:number;
	 rarity?:string;
	 relDeckCards?: RelDeckCardsDTO []
	 set_code = new Array();
	 card_set_code?: string;
	 index?:number
	 totalFound?: number;
	 archetype?: any
}

export class TipoDTO {
	id?: number;
	name?: string;
	tipoCardImgPath?: string;
	quantity?: number
}