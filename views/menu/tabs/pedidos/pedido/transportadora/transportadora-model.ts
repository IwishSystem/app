import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class TransportadoraModel extends Observable {

    public pedido;
    public transportadora: string;

    constructor() {
        super(); 
        this.pedido = storage.getItem('pedido');
        this.transportadora = this.pedido.transportadora;
    }

    public salvar (args) {
        var page = args.object.page;
        axios.patch(cache.getString("api") + "/pedidos/"+this.pedido.id_pedido+"/update",{transportadora: this.transportadora}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('pedido', result.data.pedido);
                    topmost().goBack();
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

}
