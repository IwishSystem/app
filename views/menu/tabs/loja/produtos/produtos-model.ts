import { Observable } from "tns-core-modules/data/observable";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { topmost } from "tns-core-modules/ui/frame";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";
import * as storage from "nativescript-localstorage";

export class ProdutosModel extends Observable {

    public page;
    public id_categoria: number;
    public produtos: Array<object>;
    public load: boolean;

    constructor(page, id_categoria: number) {
        super();
        this.page = page;
        this.id_categoria = id_categoria;

        this.produtos = [];
        this.load = false;
    }

    public loaded(args){
        var produtos = storage.getItem('produtos') || [];
        if(produtos.length == 0){
            this.axiosProdutos();
        } else {
            this.set('produtos', this.produtosByCategory(produtos, this.id_categoria));
        }
    }

    public axiosProdutos(){
        this.set('load', true);
        axios.get(cache.getString("api") +'/produtos', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    this.set('load', false);
                    storage.setItemObject('produtos', result.data.produtos);
                    this.set('produtos', this.produtosByCategory(result.data.produtos, this.id_categoria));
                } else {
                    this.redirectLogin(this.page);
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(this.page);
                } else {
                    alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
                }
            });
    }

    private produtosByCategory(produtos, id_category){
        var produtos_by_categoria = produtos.filter(
            (produto, index) => {
                if(produto.id_categoria == this.id_categoria){
                    return true;
                } else {
                    return false;
                }
            }, this);
        if(produtos_by_categoria.length == 0){
            this.set('empty', true);
        } else {
            this.set('empty', false);
        }
        return produtos_by_categoria;
    }

    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

    public refresh(args){
        this.axiosProdutosRefresh(args.object);
    }

    public axiosProdutosRefresh(pullRefresh){
        axios.get(cache.getString("api") +'/produtos', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                pullRefresh.refreshing = false;
                if(result.status == 200) {
                    storage.setItemObject('produtos', result.data.produtos);
                    this.set('produtos', this.produtosByCategory(result.data.produtos, this.id_categoria));
                } else {
                    this.redirectLogin(this.page);
                }
            },
            error => {
                pullRefresh.refreshing = false;
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(this.page);
                } else {
                    alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
                }
            });
    }  



    public  itemTap(args: ItemEventData){
        topmost().navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: args.view.bindingContext.id_produto }});
    }



}
