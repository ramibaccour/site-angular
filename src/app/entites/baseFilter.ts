import { DateFilter } from "./dateFilter";

export class BaseFilter
{
    operator : "%" | "=" | "%%" | ">" | ">=" | "<" | "<=" ;
    value :  DateFilter | any;
}