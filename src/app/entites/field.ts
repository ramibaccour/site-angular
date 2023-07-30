import { Filter } from "./filter";

export class Field
{
    name : string;
    type : "checkbox" | "text" | "select" | "multi-select" | "custom-select" | "date" | "number";
    label : string;
    minWidth : string;
    width : string;
    filter : Filter
    show : boolean;
    required : boolean;
    active : boolean;
    order : number;
    listeIdTypeAccueille : number[];
    listeIdTypeAccueilleForParent : number[];
    maxLength : number;
    max : number;
    buttons :  
              {
                name :string,
                icon :string,
                label : string,
                color :string
              }[];
    direction : "asc" | "desc"
}