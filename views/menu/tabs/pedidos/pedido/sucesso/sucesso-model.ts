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

            let desconto = 0;
            let acrescimo = 0;
            if(!pedido_item.produto.desconto_bloquear){
                if(pedido_item.desconto){
                    desconto = (pedido_item.desconto/100)*pedido_item.preco; 
                } else if(this.pedido.desconto){
                    desconto = (this.pedido.desconto/100)*pedido_item.preco;
                }  else if(this.pedido.pedido_pagamento){
                    desconto = (this.pedido.pedido_pagamento.desconto/100)*pedido_item.preco; 
                }
            }                



            let preco_desconto = pedido_item.preco-desconto;
            console.log(preco_desconto);
            let ipi = (pedido_item.ipi/100)*preco_desconto;

            let preco_total =  pedido_item.preco-desconto+ipi+acrescimo;
            console.log(preco_total);
            total+=preco_total*pedido_item.quantidade;
            console.log(total);
        }, this);

        this.set('total', total);

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
