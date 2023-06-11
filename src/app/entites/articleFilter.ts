import { Article } from "./article";
import { DateFilter } from "./dateFilter";

export class ArticleFilter extends Article
{
    debut_promoFilter : DateFilter
    fin_promoFilter : DateFilter
    constructor (is_deleted : number,debutPromo : DateFilter, finPromo : DateFilter)
    {
        super();
        this.is_deleted = is_deleted;
        this.debut_promoFilter = debutPromo;
        this.fin_promoFilter = finPromo;
    }
}