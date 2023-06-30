import { Resolution } from "./resolution";
import { TypeContent } from "./typeContent";

export class Image
{
    id : number;
    name : string;
    id_resolution : number;
    type_content : TypeContent;
    ordre : number;
    id_couleur : number;
    id_article : number;
    id_categorie : number;
    is_deleted : number;
    id_parametre : number;

    resolution : Resolution;
    formData = new FormData();
    
}