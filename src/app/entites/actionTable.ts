import { Field } from "./field"
export class ActionTable
{    
    action : string
    component : Field
    filter : any
    filterTable : any
    row : any
    direction : "asc" | "desc"
    selectedElement : Array<any>
}