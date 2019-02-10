import { EventData, Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class ClienteDetalheModel extends Observable {

    private id_cliente: number;
    public cliente: object;


    constructor(id_cliente: number) {
        super();
        this.id_cliente = id_cliente;
    }

    public loaded(args){
        var page = args.object.page;
        axios.get(cache.getString('api')+'/clientes/'+this.id_cliente, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    console.log(result.data);
                    this.set('cliente', result.data.cliente);
                } else {
                    this.redirectLogin(page);
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(page);
                } else {
                    alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
                }
            });
    }

    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

    public abrirPedido(args){
        var page = args.object.page;
        axios.post(cache.getString("api") + "/pedidos", {id_cliente: this.id_cliente, id_representante: cache.getNumber('id_representante')},{auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
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
                    alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
                }
            });
    }

}
// http://192.168.0.19 app@app.com.br