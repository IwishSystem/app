import {Observable, PropertyChangeData} from "tns-core-modules/data/observable";
import {TabView, SelectedIndexChangedEventData} from "tns-core-modules/ui/tab-view";
import * as storage from "nativescript-localstorage";
import { topmost, Frame } from "tns-core-modules/ui/frame";
import { Page } from "tns-core-modules/ui/page";
import { isAndroid } from "tns-core-modules/platform";
import {SearchBar} from "ui/search-bar";
import {TextView} from "ui/text-view";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";


export class MenuModel extends Observable {

    public home: string;
    public pedidos: string;
    public sacola: string;
    public loja: string;
    public mais: string;

    public default_pedido_page: string;

    public search: string;
    public produtos_search: Array<Object>;
    public scan: string;

    public page: Page;

    public index_menu;

    constructor(page: Page) {
        super();
        this.page = page;

        this.search = '';
        this.scan = '';
        this.produtos_search = [];

        this.index_menu = cache.getNumber('index_menu', 0);

        this.set("pedidos", 'res://pedido1');
        this.set("sacola", 'res://sacola1');
        this.set("loja", 'res://loja1');
        this.set("mais", 'res://mais1');

        switch(this.index_menu){
            //case 0: this.set("home", "res://home2"); break;
            case 0: this.set("pedidos", "res://pedido2"); break;
            case 1: this.set("sacola", "res://sacola2"); break;
            case 2: this.set("loja", "res://loja2"); break;
            case 3: this.set("mais", "res://mais2"); break;
        }
        //        this.set("home", "res://home1");

        //        console.log(storage.getItem('pedido'));


        if(storage.getItem('pedido')){
            this.default_pedido_page = 'views/menu/tabs/pedidos/pedido/pedido-page';
        } else {
            this.default_pedido_page = 'views/menu/tabs/pedidos/pedidos-page';
        }

        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "scan") {
                this.scanUpdate();
            }
        }, this);

        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "search") {
                this.searchChange();
            }
        }, this);

        var login = cache.getString('login', null);
        var senha = cache.getString('senha', null);
        var modal = cache.getNumber('modal', 0);
        console.log('login:'+login);
        console.log('senha:'+senha);
        console.log('modal:'+modal);
        if((!login || !senha) && modal == 0){
            this.login();
        }
        // this.login();
        //setTimeout(function(){ console.log(page.getViewById('modal-login'));  }, 3000);


    }

    public login(){
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

    public searchChange(){

        if (this.search != "") {
            let produtos = storage.getItem('produtos') || [];
            let i = 0;
            let count = 0;
            let produtos_filtrados = [];
            for(i=0; i<produtos.length;i++){
                let produto = produtos[i];
                console.log('A');
                if (produto.descricao.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                    console.log('B');
                    produtos_filtrados.push(produto);
                    count++;
                } else if (produto.codigo.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                    console.log('B');
                    produtos_filtrados.push(produto);
                    count++;
                } else if (produto.codigo_2 != null) {
                    if (produto.codigo_2.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                        console.log('B');
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
        //  http://192.168.0.19

/*
        (storage.getItem('produtos') || []).find(
            (produto, index) => {
                if (this.search != "") {
                    if (produto.codigo.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                        count++;
                        return true;
                    }
                }
            }, {search: this.search, count: 0} );


        var produtos = storage.getItem('produtos').filter((produto, index) => {
            console.log(produto);
            if (this.search != "") {
                if (produto.codigo.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                    return true;
                }

                /*if (produto.codigo_2 != null) {
                    if (produto.codigo_2.toLowerCase().indexOf(this.search.toLowerCase()) != -1) {
                        return true;
                    }  
                }*/
/*

               c
            }
            return false;
        });

        produtos = produtos.slice(-1);

        this.set('produtos_search', produtos);*/
    }

    public itemTapSearch(args){
        var page = args.object.page;

        var frame_loja = <Frame>page.getViewById('loja_frame');
        var tabview = <TabView>page.getViewById('tabViewContainer');
        var search_bar = page.getViewById('search_bar');


        frame_loja.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: args.view.bindingContext.id_produto }});
        tabview.selectedIndex = 2;
        search_bar.text = '';

    }

    //K81163   http://scancode.com.br/app  app@app.com.br


    public changed(args) {
        if (args.oldIndex !== -1) {
            const vm = (<TabView>args.object).bindingContext;

            //this.set("home", "res://home1");
            this.set("pedidos", 'res://pedido1');
            this.set("sacola", 'res://sacola1');
            this.set("loja", 'res://loja1');
            this.set("mais", 'res://mais1');

            switch(args.newIndex){
                //case 0: this.set("home", "res://home2"); break;
                case 0: this.set("pedidos", "res://pedido2"); break;
                case 1: this.set("sacola", "res://sacola2"); this.sacolaSettings(args);  break;
                case 2: this.set("loja", "res://loja2"); break;
                case 3: this.set("mais", "res://mais2"); break;
            }
            cache.setNumber('index_menu', args.newIndex);
        }

    }

    public scanUpdate(){
        console.log(topmost().currentPage);
        console.log(this.scan);
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

    private redirectLogin(page){
        var frame = page.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

    public loadedScan(args){
        var txt = args.object;
        txt.focus();
        txt.dismissSoftInput();
    }


    public sacolaSettings(args){
        var frame_sacola = <Frame>args.object.getViewById('sacola_frame');

        var page_sacola = frame_sacola.currentPage;
        if(page_sacola){

            if(isAndroid){
                var bindingContext = page_sacola.bindingContext;
                bindingContext.setPedido();
            }
        }
    }


}
