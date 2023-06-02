import { Article } from "./article";
import { DateFilter } from "./dateFilter";

export class ArticleFilter extends Article
{
    debutPromoFilter : DateFilter
    finPromoFilter : DateFilter
    constructor ()
    {
        super();
        this.debutPromoFilter = new DateFilter;
        this.finPromoFilter = new DateFilter;
    }
}