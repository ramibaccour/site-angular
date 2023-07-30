import { BaseFilter } from "./baseFilter";
import { Pager } from "./pager";

export class ParametreFilter 
{
    filter : 
    {
        id : BaseFilter;
        name : BaseFilter;
        value : BaseFilter;
        type : BaseFilter;
        sub_type : BaseFilter;
        type_content : BaseFilter;
        ordre : BaseFilter;
        visible : BaseFilter;
    }
    pager : Pager
}