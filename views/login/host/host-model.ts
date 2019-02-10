import { Observable } from "tns-core-modules/data/observable";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";

export class HostModel extends Observable {

    public url: string;

    constructor() {
        super();
        this.url = '';
    }   

    public confirm(args) {    
        var frame = args.object.page.frame;
        frame.goBack();
        console.log('confirm');
        axios.get(this.url+'/api').then(
            (result) => {
                console.log('confirm result'+ result.status);
                if(result.status == 200){
                    cache.setString('url', this.url);
                    cache.setString('api', this.url+'/api');
                    this.axiosCategorias();
                    this.axiosProdutos();
                    this.axiosClientes();    

                    
                } else {
                    alert({title: "", message: "Servidor não encontrado", okButtonText: ""});
                }
            },
            (error) => {
                console.log('confirm error'+ error.response.status);
                if(error.response.status == 404){
                    alert({title: "", message: "Servidor não encontrado", okButtonText: ""});
                } else {
                    alert({title: "", message: "Servidor não responde", okButtonText: ""});
                }
            });
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
