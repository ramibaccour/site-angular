import { baseAccueille } from "./baseAccueille";
import { Header } from "./header";
import { Resolution } from "./resolution";

export class LigneAccueille extends baseAccueille
{
    id_accueil :number;
    listeResolution : Resolution[];
    id_parent : number;
    ROWEXPAND : {
                    data : Resolution[], 
                    header : Header
                }
    ligneAccueille : LigneAccueille;

}