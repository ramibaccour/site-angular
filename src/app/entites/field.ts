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
      data : 
            [
                id : string,
                name : string
            ]
    };
    show : boolean;
    required : boolean;
    active : boolean;
    order : number;
    buttons :  
              [
                name :string,
                icon :string,
                label : string,
                color :string
              ]
}