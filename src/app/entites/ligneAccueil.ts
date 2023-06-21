import { baseAccueille } from "./baseAccueille";
import { Resolution } from "./resolution";

export class LigneAccueille extends baseAccueille
{
    id_accueil :number;
    listeResolution : Resolution[];
    id_parent : number;
}