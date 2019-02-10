import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class HistoricoModel extends Observable {

    public pedidos: Array<object>;
    public total: number;
    public ready: boolean;

    constructor() {
        super(); 
        this.ready = false;
        this.pedidos = [];
        this.total = 0;
    }

    public loaded(args){
        var page = args.object.page;
        if(this.pedidos.length == 0){
            axios.get(cache.getString("api") +'/representantes/'+cache.getNumber('id_representante')+'/historico', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
                result => {
                    if(result.status == 200) {
                        this.set('pedidos', result.data.pedidos);
                        this.set('total', result.data.total);
                        this.set('ready', true);
                    } else {
                        this.redirectLogin(page);
                    }
                },
                error => {
                    if(error.response.status == 404 || error.response.status == 401){
                        this.redirectLogin(page);
                    } else {
                        this.ready = true;
                        alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
                    }
                });
        }
    }

    public refresh(args){
        var page = args.object.page;
        var pullRefresh = args.object;
        axios.get(cache.getString("api") +'/representantes/'+cache.getNumber('id_representante')+'/historico', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            (result) => {
                pullRefresh.refreshing = false;
                if(result.status == 200) {
                    this.set('pedidos', result.data.pedidos);
                    this.set('total', result.data.total);
                } else {
                    this.redirectLogin(page);
                }
            }, (error) => {
                pullRefresh.refreshing = false;
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(page);
                } else {
                    alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
                }
            });
    }    

    public goPedido(args){
        var page = args.object.page;
        this.ready = false;
        axios.get(cache.getString("api") +'/pedidos/'+args.view.bindingContext.id_pedido, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('pedido', result.data.pedido);
                    topmost().navigate({moduleName: "views/menu/tabs/pedidos/pedido/pedido-page", clearHistory: true});
                } else {
                    this.redirectLogin(page);
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(page);
                } else {
                    this.ready = true;
                    alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
                }
            });
    }  


    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

}
