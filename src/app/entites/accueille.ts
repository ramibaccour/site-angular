import { AccueilType } from "./accueilType";
import { baseAccueille } from "./baseAccueille";
import { LigneAccueille as LigneAccueille } from "./ligneAccueil";

export class Accueille extends baseAccueille
{
    id_accueil_type : number;
    accueilType : AccueilType
    listeLigneAccueil : LigneAccueille[]
}