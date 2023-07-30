import { BaseFilter } from "./baseFilter";
import { Pager } from "./pager";

export class ArticleFilter extends Pager
{
    filter : 
    {
        id : BaseFilter;
        name : BaseFilter;
        name2 : BaseFilter;
        description : BaseFilter;
        full_description : BaseFilter;
        price : BaseFilter;
        new_price : BaseFilter;
        BaseFilter1 : BaseFilter;
        debut_promo : BaseFilter;
        fin_promo : BaseFilter;
        badge : BaseFilter;
        disponible : BaseFilter;
        quantite : BaseFilter;
        valider : BaseFilter;
        id_fournisseur : BaseFilter;
        id_marque : BaseFilter;
        tva : BaseFilter;
        is_deleted : BaseFilter;
        title_seo : BaseFilter;
        description_seo : BaseFilter;
        id_model_affichage : BaseFilter;
    }
    
    pager : Pager;
    constructor (pager : Pager, is_deleted : BaseFilter)
    {
        super();
        this.pager = pager;
        var filter;
        filter = {is_deleted : is_deleted};
        this.filter = filter;
    }
}