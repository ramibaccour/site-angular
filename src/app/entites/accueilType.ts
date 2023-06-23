import { Resolution } from "./resolution";

export class AccueilType
{
    id : number;
    type : string;
    sub_type : "LIST_GROUPE" | "LIST";
    id_resolution : number;

    resolution : Resolution
}