import {Observable, PropertyChangeData} from "tns-core-modules/data/observable";
import {TabView, SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import * as storage from "nativescript-localstorage";
import { Frame } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import {TextView} from "ui/text-view";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";


export class MenuModel extends Observable {

    public icon_pedidos: string;
    public icon_sacola: string;
    public icon_loja: string;
    public icon_mais: string;

    public default_pedido_page: string;

    public search: string;
    public produtos_search: Array<Object>;
    public scan: string;

    public page: Page;

    constructor(page: Page) {
        super();
        this.page = page;
        
        this.search = '';
        this.scan = '';
        this.produtos_search = [];
        
        this.tabSelecionada(0);


        if(storage.getItem('pedido')){
            this.default_pedido_page = 'views/menu/tabs/pedidos/pedido/pedido-page';
        } else {
            this.default_pedido_page = 'views/menu/tabs/pedidos/pedidos-page';
        }

        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "scan") {
                this.changeColetor();
            }
        }, this);

        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "search") {
                this.searchChange();
            }
        }, this);        
    }

    public loaded(args){
        this.checkLogin();
        this.focusColetor();
    }

    public selectedIndexChanged(args) {
        this.tabSelecionada(args.newIndex);
    }

    private tabSelecionada(index){
        this.resetarIcones();
        switch(index){
            case 0: this.set("icon_pedidos", "res://pedido2"); this.atualizarTelaPedidos(); break;
            case 1: this.set("icon_sacola", "res://sacola2");  this.atualizarTelaSacola(); break;
            case 2: this.set("icon_loja", "res://loja2"); break;
            case 3: this.set("icon_mais", "res://mais2"); break;
        }   
        this.focusColetor();     
    }   


    private resetarIcones() {
        this.set('icon_pedidos', 'res://pedido1');
        this.set('icon_sacola', 'res://sacola1');
        this.set('icon_loja', 'res://loja1');
        this.set('icon_mais', 'res://mais1');
    }

    private atualizarTelaPedidos(){
        let pedido_detalhe_page = this.page.getViewById('pedido_detalhe_page'); 
        console.log(pedido_detalhe_page);
        if(typeof pedido_detalhe_page !== 'undefined'){
            pedido_detalhe_page.bindingContext.atualizarTela();
            console.log('diferente de undefined');
        }
    }

    private atualizarTelaSacola(){
        let page_sacola = this.page.getViewById('page_sacola');
        page_sacola.bindingContext.atualizarTela();
    }

    public focusColetor(){
        var txt = <TextView>this.page.getViewById('scan');
        setTimeout(function(){ 
            txt.focus();
            txt.dismissSoftInput();
        }, 100);
    }

    public changeColetor(){
        if((this.scan.match(/\n/g)||[]).length == 1){
            var txt = <TextView>this.page.getViewById('scan');
            var search = txt.text;
            txt.text = '';
            search = search.replace(/(\r\n\t|\n|\r\t)/gm,"");
            this.searchProduto(search);
        }
    }

    public searchProduto(search){
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
            var tab = <TabView>this.page.getViewById('tabViewContainer');
            tab.selectedIndex = 3;
            var frameLoja = <Frame>this.page.getViewById('loja_frame');
            frameLoja.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: produto.id_produto }});
        } else {
            axios.get(cache.getString("api") + "/produtos/"+search+"/find", {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
                result => {
                    if(result.status == 200) {
                        var produto = result.data.produto;
                        if(produto){
                            var tab = <TabView>this.page.getViewById('tabViewContainer');
                            tab.selectedIndex = 3;
                            var frameLoja = <Frame>this.page.getViewById('loja_frame');
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

    public searchChange(){
        if (this.search != "") {
            let produtos = storage.getItem('produtos') || [];
            let i = 0;
            let count = 0;
            let produtos_filtrados = [];
            for(i=0; i<produtos.length;i++){
                let produto = produtos[i];
                if (produto.descricao.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                    produtos_filtrados.push(produto);
                    count++;
                } else if (produto.codigo.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                    produtos_filtrados.push(produto);
                    count++;
                } else if (produto.codigo_2 != null) {
                    if (produto.codigo_2.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                        produtos_filtrados.push(produto);
                        count++;
                    }  
                }

                if(count == 3){
                    break;
                }
            }
            this.set('produtos_search', produtos_filtrados);
        } else {
            this.set('produtos_search', []);
        }
    }

    public itemTapSearch(args){
        var page = args.object.page;

        var frame_loja = <Frame>page.getViewById('loja_frame');
        var tabview = <TabView>page.getViewById('tabViewContainer');
        var search_bar = page.getViewById('search_bar');


        frame_loja.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: args.view.bindingContext.id_produto }});
        tabview.selectedIndex = 2;
        search_bar.text = '';

        this.loadedScan();

    }


    private redirectLogin(page){
        var frame = page.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
        this.page

    }

    public loadedScan(){
        var txt = <TextView>this.page.getViewById('scan');
        setTimeout(function(){ 
            txt.focus();
            txt.dismissSoftInput();
        }, 100);
    }



    public checkLogin(){
        var login = cache.getString('login', null);
        var senha = cache.getString('senha', null);
        var modal = cache.getNumber('modal', 0);
        if((!login || !senha) && modal == 0){
            this.login();
        }
    }

    public login(){
        const pedidos_frame = <Frame>this.page.getViewById('pedidos_frame');
        const loja_frame = <Frame>this.page.getViewById('loja_frame');

        const tabViewContainer = <TabView>this.page.getViewById('tabViewContainer');
       
        pedidos_frame.navigate({moduleName: "views/menu/tabs/pedidos/pedidos-page", clearHistory: true});
        loja_frame.navigate({moduleName: "views/menu/tabs/loja/loja-page", clearHistory: true}); 
        
        tabViewContainer.selectedIndex = 0;
        
        cache.setNumber('modal', 1);
        this.page.showModal("views/modal-login/login-page", {},
            (result) => {
                cache.setNumber('modal', 0);
                this.updateDataLogin();
            }, true);
    }

    public updateDataLogin(){
        this.axiosCategorias();
        this.axiosProdutos();
        this.axiosClientes();   
    }    

    public axiosCategorias(){
        axios.get(cache.getString('api')+'/categorias').then(
            (result) => {
                if(result.status == 200) {
                    storage.setItemObject('categorias', result.data.categorias);
                    this.set('categorias', result.data.categorias);
                } else {
                    alert({title: "", message: "Categorias não carregado1", okButtonText: ""});
                }
            }, (error) => {
                if(error.response.status == 404 || error.response.status == 401){
                    alert({title: "", message: "Categorias não carregado2:"+ error.response.status, okButtonText: ""});
                } else {
                    alert({title: "", message: "Categorias não carregado3", okButtonText: ""});
                }
            });
    }

    public axiosProdutos(){
        axios.get(cache.getString("api") +'/produtos', {auth: {username: 'admin', password: '123456'}}).then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('produtos', result.data.produtos);
                } else {
                    alert({title: "", message: "Produtos não carregado1", okButtonText: ""});
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    alert({title: "", message: "Produtos não carregado2", okButtonText: ""});
                } else {
                    alert({title: "", message: "Produtos não carregado3", okButtonText: ""});
                }
            });
    }

    public axiosClientes(){
        axios.get(cache.getString("api") +'/clientes').then(
            result => {
                if(result.status == 200) {
                    storage.setItemObject('clientes', result.data.clientes);
                } else {
                    alert({title: "", message: "Clientes não carregado 1", okButtonText: ""});
                }
            },
            error => {
                if(error.response.status == 404 || error.response.status == 401){
                    alert({title: "", message: "Clientes não carregado2", okButtonText: ""});
                } else {
                    alert({title: "", message: "Clientes não carregado3", okButtonText: ""});
                }
            });
    }


}
