export class Article
{
    id? : number;
    name? : string;
    description? : string;
    full_description? : string;
    price? : number;
    new_price? : number;
    debut_promo? : Date;
    fin_promo? : Date;
    badge? : string;
    disponible? : number;
    quantite? : number;
    valider? : number;
    id_fournisseur? : number;
    id_marque? : number;
    tva? : number;
    is_deleted? : number;
    title_seo? : string;
    description_seo? : string;
    constructor()
    {
        // this.id = -1;
        // this.name = "";
        // this.description = "";
        // this.full_description = "";
        // this.price = 0;
        // this.new_price = 0;
        // // this.debut_promo = new Date();
        // // this.fin_promo = new Date();
        // this.badge = "";
        // this.disponible = 0;
        // this.quantite = 0;
        // this.is_deleted = 0;
        // this.valider = 0;
        // this.id_fournisseur = 0;
        // this.id_marque = 0;
        // this.tva = 0;
        // this.title_seo = "";
        // this.description_seo = "";
    }
}