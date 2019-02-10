import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class PagamentoModel extends Observable {

    public pedido;
    public pagamentos;
    public index: number;

    constructor() {
        super(); 
        this.pedido = storage.getItem('pedido');
        this.index = 0;
        this.pagamentos = [];
    }

    public loaded(args){
        var page = args.object.page;
        axios.get(cache.getString('api')+'/pagamentos', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    var pagamentos = [];

                    pagamentos.push('Selecionar um pagamento ');
                    result.data.pagamentos.forEach((pagamento, index) => {
                        pagamentos.push({ data: pagamento, toString: () => { return pagamento.descricao; } });
                        if(this.pedido.pedido_pagamento){
                            if(this.pedido.pedido_pagamento.id_condicao_pagamento == pagamento.id_condicao_pagamento){
                                this.set('index', index+1);
                            }
                        }
                        
                    });
                    
                    this.set('pagamentos', pagamentos);

                    this.set('cliente', result.data.cliente);
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

    public salvar (args) {
        if(this.index != 0){

            var page = args.object.page;

            axios.patch(cache.getString("api") + "/pedidos/"+this.pedido.id_pedido+'/updatePagamento' ,{id_condicao_pagamento: this.pagamentos[this.index].data.id_condicao_pagamento}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
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

        } else {
            alert('Pagamento não selecionado');
        }
    }

    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

}
