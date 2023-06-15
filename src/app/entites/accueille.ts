import { AccueilType } from "./accueilType";

export class Accueille
{
    id? : number;
    name? : string;
    text? : string;
    image? : string;
    type_content? : string;
    ordre? : number;
    is_deleted? : number;
    id_accueil_type? : number;
    id_article? : number;
    id_categorie? : number;

    accueilType? : AccueilType
}