import { InsideDeckDTO } from "./InsideDeckDTO";

export class SetDetailsDTO {

    id!:number;
    nome!:string;
    nomePortugues?:string;
    qtd_cards?:number;
    qtd_comuns?:number;
    qtd_raras?: number;
    qtd_super_raras?: number;
    qtd_ultra_raras?: number;
    qtd_secret_raras?: number;
    lancamento?: Date;
    setType?: string;
    dt_criacao?: Date
    isSpeedDuel?: string;
    isBasedDeck?:boolean;
    insideDeck?: InsideDeckDTO[];
    statsQuantityByAttribute?: [];
    statsQuantityByLevel?: [];
    statsQuantityByProperty?: [];
    statsQuantityByGenericType?: any;
    statsQuantityByType?: any;
    statsAtk?: [];
    statsDef?: [];
    imgurUrl?: string;
    imagem?:string
    setCode?:string
    description?:string;
    quantityUserHave!: number
}

