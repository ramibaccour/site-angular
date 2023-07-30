import { BaseFilter } from "./baseFilter";

export class Filter extends BaseFilter
{
    show : Boolean;
    type : String;
    showEmptyValue : boolean;
    returnProperty : string;   
    data : any[];
    name : string;
    id : string;
}