import { BaseFilter } from "./baseFilter";
import { Pager } from "./pager";

export class CategorieFilter extends Pager
{
    filter : 
    {
        id : BaseFilter;
        name : BaseFilter;
        description : BaseFilter;
        id_parent : BaseFilter;
        ordre : BaseFilter;
        is_deleted : BaseFilter;
        title_seo : BaseFilter;
        description_seo : BaseFilter;
    }
    idList : number[]
}