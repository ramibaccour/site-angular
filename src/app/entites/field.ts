export class Field
{
    name : string;
    type : "checkbox" | "text" | "select" | "multi-select" | "custom-select" | "date" | "number";
    label : string;
    minWidth : string;
    width : string;
    filter : 
    {
      show : boolean;
      type : string;
      showEmptyValue : boolean,
      returnProperty : string,
      value : string | 
              {
                "start" :  Date, 
                "end" : Date
              },
      data : any[];
      // pour data (name ant id property for liste data)
      name : string;
      id : string;
      operator : "%" | "=" | "%%" | ">" | ">=" | "<" | "<=" ;
    };
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