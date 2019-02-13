import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class TransportadoraModel extends Observable {

    public pedido;
    public transportadoras;
    public transportadoras_list_view;

    public transportadora: string;

    constructor() {
        super(); 
        this.pedido = storage.getItem('pedido');
        this.transportadora = this.pedido.transportadora;
        this.transportadoras = [];

        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "transportadora") {
                this.atualizarLista();
            }
        }, this);
    }


    public loaded(args){
        var page = args.object.page;
        axios.get(cache.getString('api')+'/transportadoras', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    this.set('transportadoras', result.data.transportadoras);
                } else {
                    this.redirectLogin(page);
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(page);
                } else {
                    alert({title: "", message: "Opps,Ocorreu alguma falha ", okButtonText: ""});
                }
            });
    }

    public atualizarLista(){
        let transportadoras_list_view = this.transportadoras.filter((transportadora, index) => {
            if (this.transportadora != "") {
                if (transportadora.descricao.toLowerCase().indexOf(this.transportadora.toLowerCase()) != -1) {
                    return true;
                }
            }
            return false;
        });
        this.set('transportadoras_list_view', transportadoras_list_view.slice(0, 3));
    }


    public itemTap(args){
        const transportadora = args.view.bindingContext;
        console.log(transportadora);

        var page = args.object.page;
        axios.patch(cache.getString("api") + "/pedidos/"+this.pedido.id_pedido+"/update",{transportadora: transportadora.descricao, transportadora_codigo: transportadora.codigo}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('pedido', result.data.pedido);
                    page.frame.navigate({moduleName: "views/menu/tabs/pedidos/pedido/pedido-page", clearHistory: true});
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


    public transportadoraNovo(){
        topmost().navigate("views/menu/tabs/pedidos/pedido/transportadora/novo/transportadora-novo-page");
    }


    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

}