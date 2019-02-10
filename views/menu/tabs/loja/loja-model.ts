import { Observable } from "tns-core-modules/data/observable";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";

export class LojaModel extends Observable {

    public page;
    public load: boolean;
    public categorias: Array<object>;

    constructor(page) {
        super();this.page = page;
        this.load = false;
        this.categorias = [];
    }

    public loaded(args){
        var categorias = storage.getItem('categorias') || [];
        if(categorias.length == 0){
            this.axiosCategorias();
        } else {
            this.set('categorias', categorias);
        }
    }

    public axiosCategorias(){
        this.set('load', true);
        axios.get(cache.getString('api')+'/categorias', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            (result) => {
                this.set('load', false);
                if(result.status == 200) {
                    storage.setItemObject('categorias', result.data.categorias);
                    this.set('categorias', result.data.categorias);
                } else {
                    this.redirectLogin(this.page);
                }
            }, (error) => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(this.page);
                } else {
                    alert({title: "", message: "Opps, Ocorreu alguma falha", okButtonText: ""});
                }
            });
    }

    public refresh(args){
        this.axiosCategoriasRefresh(args.object)
    }

    public axiosCategoriasRefresh(pullRefresh){
        axios.get(cache.getString('api')+'/categorias', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            (result) => {
                pullRefresh.refreshing = false;
                if(result.status == 200) {
                    storage.setItemObject('categorias', result.data.categorias);
                    this.set('categorias', result.data.categorias);
                } else {
                    this.redirectLogin(this.page);
                }
            }, (error) => {
                pullRefresh.refreshing = false;
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(this.page);
                } else {
                    alert({title: "", message: "Opps, Ocorreu alguma falha", okButtonText: ""});
                }
            });
    }

    public  itemTap(args: ItemEventData){
        topmost().navigate({moduleName: "views/menu/tabs/loja/produtos/produtos-page", context: { id_categoria: args.view.bindingContext.id_categoria }});
    }

    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

}
