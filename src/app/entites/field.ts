export class Field
{
    name : string;
    type : string;
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
    };
    show : boolean;
    required : boolean;
    active : boolean;
    order : number;
    listeIdTypeAccueille : number[];
    listeIdTypeAccueilleForParent : number[];
    buttons :  
              {
                name :string,
                icon :string,
                label : string,
                color :string
              }[];
    direction : "asc" | "desc"
}