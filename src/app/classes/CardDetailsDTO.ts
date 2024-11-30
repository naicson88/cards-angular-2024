import { ArchetypeDTO } from "../component/archetype/archetype.component";
import { AtributoDTO } from "./AtributoDTO";
import { CardRarityDTO } from "./CardRarityDTO";
import { TipoDTO } from "./TipoDTO";

export class CardDetailsDTO {
    id!: number;
    numero?: string;
    categoria?: string;
    nome!: string
    atributo!:AtributoDTO
    propriedade?: string;
    nivel?: number;
    atk?: number;
    def?: number;
    descricao?: string;
    imagem!: string;
    escala?: null;
    descr_pendulum?: string;
    descr_pendulum_pt?: string;
    qtd_link?: number;
    sets?: any;
    genericType?: string;
    tipo!: TipoDTO
    archetype?: ArchetypeDTO;
    registryDate?: Date;
    alternativeCardNumber?: number;
    cardNumber?: number;
    cardSetCode?: string;
    card_price?: number;
    card_raridade?: string;
    isSideDeck?: boolean;
    isSpeedDuel?: boolean;
    listCardRarity?: CardRarityDTO[];
    fullCardTypeDescription?:string
}