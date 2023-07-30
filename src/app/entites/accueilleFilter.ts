import { BaseFilter } from "./baseFilter";
import { Pager } from "./pager";

export class AccueilleFilter extends Pager
{
    filter : 
    {
        id : BaseFilter;
        name : BaseFilter;
        name2 : BaseFilter;
        text : BaseFilter;
        text2 : BaseFilter;
        image : BaseFilter;
        number1 : BaseFilter;
        type_content : BaseFilter;
        ordre : BaseFilter;
        is_deleted : BaseFilter;
        id_article : BaseFilter;
        id_categorie : BaseFilter;
        facebook : BaseFilter;
        linkedin : BaseFilter;
        id_accueil_type : BaseFilter;
    }
    pager : Pager
}