import { Field } from "./field";

export class Header
{
    fields : Field[];
    showFilter : boolean;
    breakpoint : number;
    selectable :  "list" | "unique";
}