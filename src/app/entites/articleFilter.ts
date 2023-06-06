import { Article } from "./article";
import { DateFilter } from "./dateFilter";

export class ArticleFilter extends Article
{
    debut_promoFilter : DateFilter
    fin_promoFilter : DateFilter
    constructor (debutPromo : DateFilter, finPromo : DateFilter)
    {
        super();
        this.is_deleted = 0;
        this.debut_promoFilter = debutPromo;
        this.fin_promoFilter = finPromo;
    }
}