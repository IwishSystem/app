import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class CompradorModel extends Observable {

    public pedido;
    public nome: string;
    public email: string;
    public telefone: string;

    constructor() {
        super(); 
        this.pedido = storage.getItem('pedido');
        this.nome = this.pedido.nome_comprador;
        this.email = this.pedido.email_comprador;
        this.telefone = this.pedido.tel_comprador;
    }

    public salvar (args) {
        var page = args.object.page;
        axios.patch(cache.getString("api") + "/pedidos/"+this.pedido.id_pedido+"/update",{nome_comprador: this.nome, email_comprador: this.email, tel_comprador: this.telefone}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
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

    private redirectLogin(page){
        page.frame.pega.bindingContext.login();
    }

}
