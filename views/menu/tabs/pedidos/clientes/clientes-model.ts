import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { topmost } from "tns-core-modules/ui/frame";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";
import * as storage from "nativescript-localstorage";


export class ClientesModel extends Observable {

    public page;
    public clientes: Array<object>;
    public clientes_todos: Array<object>;
    public search: string;

    constructor(page) {
        super();
        this.page = page;
        this.clientes = [];
        this.clientes_todos = [];
        this.search = '';

        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "search") {
                this.updateClientes();
            }
        }, this);

    }

    public loaded(args){
        var clientes = storage.getItem('clientes') || [];
        if(clientes.length == 0){
            this.axiosClientes();
        } else {
            this.clientes_todos = clientes;
        }
    }

    private axiosClientes(){
        axios.get(cache.getString("api") +'/clientes').then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('clientes', result.data.clientes);
                    this.clientes_todos = result.data.clientes;
                } else {
                    this.redirectLogin(this.page);
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(this.page);
                } else {
                    alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
                }
            });
    }

    private updateClientes(){
        var clientes_filtrados = this.clientes_todos.filter((cliente, index) => {
            if (this.search != "") {
                if (cliente.id_cliente.toString().indexOf(this.search) != -1) {
                    return true;
                }
                if (cliente.nome_fantasia != null) {
                    if (cliente.nome_fantasia.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                        return true;
                    }   
                }
                if (cliente.cpf_cnpj != null) {
                    if (cliente.cpf_cnpj.indexOf(this.search) != -1) {
                        return true;
                    }
                }
            }
            return false;
        });

        clientes_filtrados = clientes_filtrados.slice(-3);


        this.set('clientes', clientes_filtrados);
    }

    public clienteNovo(args){
        topmost().navigate("views/menu/tabs/pedidos/clientes/novo/cliente-novo-page");
    }

    public onItemTap(args: ItemEventData){
        topmost().navigate({moduleName: "views/menu/tabs/pedidos/clientes/detalhe/cliente-detalhe-page", context:  {id_cliente: args.view.bindingContext.id_cliente }});
    }

    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }


}
// http://192.168.0.19