import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { topmost, Frame } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { TabView } from "tns-core-modules/ui/tab-view";
import {LoadingIndicator} from "nativescript-loading-indicator-new";

export class PedidoModel extends Observable {

    public loader;
    public loader_options;

    public page;
    public pedido;

    public pedido_pagamento: string;    
    public comprador: string;
    public entrega: string;
    public transportadora: string;
    public observacao: string;
    public desconto: string;

    public text_btn: string;

    public preco_total_atual: number;
    public preco_total_futuro: number;
    public preco_total: number;
    public preco_total_minimo: number;
    public quantidade_total: number;

    public bg: string;

    constructor(page) {
        super(); 
        this.loader = new LoadingIndicator();
        this.loader_options =  {
            message: 'Imprimindo Pedido...',
            progress: 0.65,
            android: {
                indeterminate: true,
                cancelable: false,
                max: 100,
                progressNumberFormat: "%1d/%2d",
                progressPercentFormat: 0.53,
                progressStyle: 1,
                secondaryProgress: 1
            },
            ios: {
                details: "Additional detail note!",
                square: false,
                margin: 10,
                dimBackground: true,
                color: "#4B9ED6"
            }
        };
        this.page = page;
        this.update();
    }

    public loaded(args){
        this.update();
    }

    public update(){
        this.set('pedido', storage.getItem('pedido'));   

        //observacao
        if(this.pedido.observacao == null){
            this.set('observacao', 'SEM OBSERVACAO');
        } else {
            this.set('observacao', this.pedido.observacao);
        }

        // transportadora
        if(this.pedido.transportadora == null){
            this.set('transportadora', 'TRANSPORTADORA INDEFINIDA');
        } else {
            this.set('transportadora', this.pedido.transportadora);
        }

        // entrega
        if(this.pedido.entrega != null){
            if(!this.pedido.entrega) {
                this.set('entrega', 'INTEGRAL');
            } else {
                this.set('entrega', 'PARCIAL');
            }
        } else {
            this.set('entrega', 'ENTREGA INDEFINIDA');
        }

        // comprador
        var comprador = '';             
        if(this.pedido.nome_comprador != null){
            comprador += this.pedido.nome_comprador;
        }
        if(this.pedido.email_comprador != null){
            if(comprador != ''){
                comprador+='\n'
            }
            comprador += this.pedido.email_comprador;
        }
        if(this.pedido.tel_comprador != null){
            if(comprador != ''){
                comprador+='\n'
            }
            comprador += this.pedido.tel_comprador;
        } 
        if(comprador == '') {
            this.set('comprador', 'COMPRADOR INDEFINIDO');
        } else {
            this.set('comprador', comprador);
        }

        //pagamento
        if(this.pedido.pedido_pagamento != null){
            this.set('pedido_pagamento', this.pedido.pedido_pagamento.condicao_pagamento.descricao);
        } else {
            this.set('pedido_pagamento', 'PAGAMENTO INDEFINIDO');
        }


        // desconto do pedido
        //observacao
        if(this.pedido.desconto == null){
            this.set('desconto', 'NENHUM');
        } else {
            this.set('desconto', this.pedido.desconto);
        }


        // quantidade total
        let preco_total_minimo = 0;
        var quantidade = 0;
        this.pedido.pedido_itens.forEach((pedido_item) => {
            quantidade += pedido_item.quantidade;
        });
        this.set('quantidade_total', quantidade);

        // preco total atual
        if(this.pedido.pedido_itens.length > 0) {
            var sum = 0;
            this.pedido.pedido_itens.forEach(function(pedido_item){
                if(pedido_item.estoque_atual_qtd){
                    let desconto = 0;
                    let acrescimo = 0;
                    if(this.pedido.desconto){
                        desconto = (this.pedido.desconto/100)*pedido_item.preco;
                    } else if(pedido_item.desconto){
                        desconto = (pedido_item.desconto/100)*pedido_item.preco; 
                    } else if(this.pedido.pedido_pagamento){
                        desconto = (this.pedido.pedido_pagamento.desconto/100)*pedido_item.preco; 
                        acrescimo = (this.pedido.pedido_pagamento.acrescimo/100)*pedido_item.preco; 
                    }

                    let preco_desconto = pedido_item.preco-desconto;
                    let ipi = (pedido_item.ipi/100)*preco_desconto;
                    

                    let preco_total =  pedido_item.preco-desconto+ipi+acrescimo;

                    preco_total_minimo+= (pedido_item.preco+ipi+acrescimo)*pedido_item.estoque_atual_qtd;

                    sum+= preco_total * pedido_item.estoque_atual_qtd;
                }
            }, this);
            this.set('preco_total_atual', sum);
        }
        else {
            this.set('preco_total_atual', 0);
        }

        // preco total futuro http://192.168.0.19   app@app.com.br
        if(this.pedido.pedido_itens.length > 0) {
            var sum = 0;
            this.pedido.pedido_itens.forEach(function(pedido_item){
                if(pedido_item.estoque_futuro_qtd){
                    let desconto = 0;
                    let acrescimo = 0;
                    if(this.pedido.desconto){
                        desconto = (this.pedido.desconto/100)*pedido_item.preco;
                    } else if(pedido_item.desconto){
                        desconto = (pedido_item.desconto/100)*pedido_item.preco; 
                    } else if(this.pedido.pedido_pagamento){
                        desconto = (this.pedido.pedido_pagamento.desconto/100)*pedido_item.preco; 
                        acrescimo = (this.pedido.pedido_pagamento.acrescimo/100)*pedido_item.preco; 
                    }

                    let preco_desconto = pedido_item.preco-desconto;
                    let ipi = (pedido_item.ipi/100)*preco_desconto;
                    
                    let preco_total =  pedido_item.preco-desconto+ipi+acrescimo;
                    preco_total_minimo+= (pedido_item.preco+ipi+acrescimo)*pedido_item.estoque_futuro_qtd;

                    sum+=preco_total*pedido_item.estoque_futuro_qtd;
                }
            }, this);
            this.set('preco_total_futuro', sum);
        }
        else {
            this.set('preco_total_futuro', 0);
        }

        // preco total
        this.set('preco_total_minimo', preco_total_minimo);
        this.set('preco_total', this.preco_total_atual+this.preco_total_futuro);

        // text btn
        switch(this.pedido.id_status){
            case 6: this.set('text_btn', 'FECHAR '); break;
            case 1: this.set('text_btn', 'ATIVAR'); break;
            case 2: this.set('text_btn', 'CONCLUÍDO'); break;
            case 3: this.set('text_btn', 'CANCELADO'); break;
            case 4: this.set('text_btn', 'RESERVADO'); break;
            default: this.set('text_btn', 'INDEFINIDO'); break;
        }

        // bg
        if(this.pedido.id_status == 6){
            this.set('bg', 'bg-red');
        } else {
            this.set('bg', 'bg-gray');
        }
    }

    public ativarCamera(args){
        let barcodescanner = new BarcodeScanner();

        barcodescanner.scan({
            formats: "QR_CODE, EAN_13,CODE_128",
            showFlipCameraButton: true,
            preferFrontCamera: false,
            showTorchButton: true,
            beepOnScan: true,
            torchOn: false,
            resultDisplayDuration: 0,
            openSettingsIfPermissionWasPreviouslyDenied: true
        }).then((result) => {
            this.search(result.text);
        }, (errorMessage) => {
            alert('Erro scanning');
        });
    }

    public search(search){
        var produtos = storage.getItem('produtos') || [];
        var produto = produtos.find(
            (produto) => {
                if(produto.id_produto == search){
                    return true;
                } else {
                    return false;
                }
            });
        if(produto) {

            var tab = <TabView>topmost().currentPage.parent.parent.parent;
            tab.selectedIndex = 3;
            var frameLoja = <Frame>topmost().currentPage.parent.parent.parent.parent.getViewById('loja_frame');
            frameLoja.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: produto.id_produto }});

        } else {
            axios.get(cache.getString("api") + "/produtos/"+search+"/find", {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
                result => {
                    if(result.status == 200) {
                        var produto = result.data.produto;
                        if(produto){
                            var tab = <TabView>topmost().currentPage.parent.parent.parent;
                            tab.selectedIndex = 3;
                            var frameLoja = <Frame>topmost().currentPage.parent.parent.parent.parent.getViewById('loja_frame');
                            frameLoja.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: produto.id_produto }});
                        } else {
                            alert({title: "", message: "Produto não encontrado", okButtonText: ""});
                        }
                    } else {
                        this.redirectLogin(this.page);
                    }
                },
                error => {
                    alert(error.response.status);
                    if(error.response.status == 404 || error.response.status == 401){
                        this.redirectLogin(this.page);
                    } else {
                        alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
                    }
                });
        }
    }

    public print(args){
        if(this.pedido.id_status == 2) {
            var page = args.object.page;
            axios.get(cache.getString('api') + '/pedido/'+this.pedido.id_pedido+'/concluido/pdf', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
                result => {
                    if(result.status == 200) {
                        alert('Impressão solicitada');
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
            alert('Pedido não está concluido ');
        }
    }

    public gotoPagePagamento(){
        if(this.pedido.id_status == 6) {
            var id_condicao_pagamento = null;
            if(this.pedido.pedido_pagamento){
                id_condicao_pagamento = this.pedido.pedido_pagamento.id_condicao_pagamento;
            }
            topmost().navigate("views/menu/tabs/pedidos/pedido/pagamento/pagamento-page");
        }
    }

    public gotoPageComprador(){
        if(this.pedido.id_status == 6) {
            topmost().navigate("views/menu/tabs/pedidos/pedido/comprador/comprador-page");
        }
    }

    public gotoPageEntrega(){
        if(this.pedido.id_status == 6) {
            topmost().navigate("views/menu/tabs/pedidos/pedido/entrega/entrega-page");
        }
    }
    public gotoPageTransportadora(){
        if(this.pedido.id_status == 6) {
            topmost().navigate("views/menu/tabs/pedidos/pedido/transportadora/transportadora-page");
        }
    }
    public gotoPageObservacao(){
        if(this.pedido.id_status == 6) {
            topmost().navigate("views/menu/tabs/pedidos/pedido/observacao/observacao-page");
        }
    }

    public showDescontoModal(args){
        let desconto = 0;
        if(this.desconto != 'NENHUM'){
            desconto = Number(this.desconto);
        }
        args.object.showModal("views/menu/tabs/loja/produto/desconto/desconto-page", {desconto: desconto, desconto_max: 100},
            (desconto) => {
                if(desconto){  
                    this.salvarDesconto(args, desconto);
                }
            });
    }

    private salvarDesconto (args, desconto) {
        var page = args.object.page;
        axios.patch(cache.getString("api") + "/pedidos/"+this.pedido.id_pedido+"/update",{desconto: desconto}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('pedido', result.data.pedido);
                    this.update();
                    alert('Desconto Atualizado');
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

    private finalizarPedido(args){ 
        if(this.pedido.id_status == 6) {
            if(this.pedido.pedido_pagamento != null){
                if(this.pedido.pedido_pagamento.condicao_pagamento.valor_minimo > this.preco_total_minimo){
                    alert({title: "", message: "Valor minimo para esta forma de pagamento é R$"+this.pedido.pedido_pagamento.condicao_pagamento.valor_minimo, okButtonText: ""});
                } else {
                    this.finalizarPedidoFinal(args);
                    //topmost().navigate("views/menu/tabs/pedidos/pedido/assinatura/assinatura-page");
                }
            } else {
                alert({title: "", message: "Pagmento indefinido", okButtonText: ""});
            }
        } else if(this.pedido.id_status == 1) {
            var page = args.object.page;
            axios.patch(cache.getString('api') + '/pedidos/'+this.pedido.id_pedido+'/update', {id_status: 6}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
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


    private finalizarPedidoFinal(args){
        this.loader.show(this.loader_options);
        axios.patch(cache.getString('api') + '/pedidos/'+this.pedido.id_pedido+'/update',{id_status: 2}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            (result) => {
                if(result.status == 200) {
                    this.page.frame.navigate({moduleName: "views/menu/tabs/pedidos/pedidos-page", clearHistory: true});
                } else {
                    this.redirectLogin(this.page);
                }
                this.loader.hide();

            },
            (error) => {
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(this.page);
                } else {
                    alert({title: "", message: 'Falha no serviço, entre em contato com administrador', okButtonText: ''});
                }
                this.loader.hide();
            });
    }

    private redirectLogin(page){
        this.page.frame.page.frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

}
