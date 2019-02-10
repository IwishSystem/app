import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class SucessoModel extends Observable {

    public pedido;
    public total: number;
    public desconto: number;


    constructor() {
        super(); 

        this.pedido = storage.getItem('pedido');
        storage.setItemObject('pedido', null);

        var total = 0;
        var itens = this.pedido.pedido_itens;

        this.pedido.pedido_itens.forEach(function(pedido_item){
            total+=pedido_item.quantidade+pedido_item.preco;
        });

        this.set('total', total);
        this.set('desconto', this.total*(100-this.pedido.pedido_pagamento.desconto));

    }

    public gotoClientes(){
        topmost().navigate("views/menu/tabs/pedidos/clientes/clientes-page");
    }

    public gotoHistorico(){
        topmost().navigate("views/menu/tabs/pedidos/historico/historico-page");
    }

    public gotoHome(){
        topmost().navigate("views/menu/tabs/pedidos/pedidos-page");
    }

}
