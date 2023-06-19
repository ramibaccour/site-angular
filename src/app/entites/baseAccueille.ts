import { Article } from "./article";
import { Categorie } from "./categorie";

export  class baseAccueille
{
    id : number;
    name : string;
    text : string;
    image : string;
    type_content : string;
    ordre : number;
    is_deleted : number;
    id_article : number;
    id_categorie : number;

    article : Article;
    categorie : Categorie;
}