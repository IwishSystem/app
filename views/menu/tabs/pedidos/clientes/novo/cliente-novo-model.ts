import { EventData, Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";

export class ClienteNovoModel extends Observable {

    public nome_fantasia: string;
    public razao_social: string;
    public cpf_cnpj: string;
    public inscricao_estadual: string;
    public nome_contato: string;
    public nome_comprador: string;
    public email: string;
    public tel_1: string;
    public tel_2: string;
    public logradouro: string;
    public bairro: string;
    public cidade: string;
    public uf: string;
    public cep: string;
    public transportadora: string;

    constructor() {
        super();
        this.nome_fantasia = "";
        this.razao_social = "";
        this.cpf_cnpj = "";
        this.inscricao_estadual = "";
        this.nome_contato = "";
        this.nome_comprador = "";
        this.email = "";
        this.tel_1 = "";
        this.tel_2 = "";
        this.logradouro = "";
        this.bairro = "";
        this.cidade = "";
        this.uf = "";
        this.cep = "";
        this.transportadora = "";
    }

    public abrirPedido(args){
        var page = args.object.page;
        axios.post(cache.getString("api") + "/pedidos/novo/cliente", {
            nome_fantasia: this.nome_fantasia,
            razao_social: this.razao_social,
            cpf_cnpj: this.cpf_cnpj,
            inscricao_estadual: this.inscricao_estadual,
            nome_contato: this.nome_contato,
            nome_comprador: this.nome_comprador,
            email: this.email,
            tel_1: this.tel_1,
            tel_2: this.tel_2,
            transportadora: this.transportadora,
            logradouro: this.logradouro,
            bairro: this.bairro,
            cidade: this.cidade,
            uf: this.uf,
            cep: this.cep,
            id_representante: cache.getNumber('id_representante')},
            {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
            result => {
                console.log(result.data);
                if(result.status == 200) {
                    storage.setItemObject('pedido', result.data.pedido);
                    topmost().navigate({moduleName: "views/menu/tabs/pedidos/pedido/pedido-page", clearHistory: true});
                } else {
                    this.redirectLogin(page);
                }
            },
            error => {
                console.log('status error: '+error.response.status);
                console.log(error.response.data);
                if(error.response.status == 404 || error.response.status == 401){
                    this.redirectLogin(page);
                } else if (error.response.status == 422) {

                    var errors = Object.keys(error.response.data).map(key => error.response.data[key]);
                    errors.forEach(field => {
                        field.forEach(message => {
                            alert({title: "", message: message, okButtonText: "Voltar"});
                        });
                    });
                } else {
                    alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
                }
            });
        }

        public apiCep(args){
            var page = args.object.page;
            axios.get(cache.getString("api") + "/utils/cep/"+this.cep).then(
                result => {
                    if(result.status == 200) {
                        if(result.data.endereco){
                            this.set('uf', result.data.endereco.uf);
                            this.set('cidade', result.data.endereco.localidade);
                            this.set('bairro', result.data.endereco.bairro);
                            this.set('logradouro', result.data.endereco.logradouro);
                        }
                    } else {
                        this.redirectLogin(page);
                    }
                },
                error => {
                    if(error.response.status == 404){
                        this.redirectLogin(page);
                    } else {
                        alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
                    }
                });
        }

        public apiCnpj(args){
            var page = args.object.page;
            axios.get(cache.getString("api") + "/utils/cnpj/"+this.cpf_cnpj).then(
                result => {
                    if(result.status == 200) {
                        if(result.data.dados) {
                            if(result.data.dados.status != 'ERROR'){
                                var empresa = result.data.dados;

                                this.set('nome_fantasia', empresa.fantasia);
                                this.set('razao_social', empresa.nome);
                                this.set('email', empresa.email);
                                this.set('tel_1', empresa.telefone);
                                this.set('logradouro', empresa.logradouro+', '+empresa.numero);
                                this.set('bairro', empresa.bairro);
                                this.set('cidade', empresa.municipio);
                                this.set('uf', empresa.uf);
                                this.set('cep', empresa.cep);
                            }
                        }
                    } else {
                        this.redirectLogin(page);
                    }
                },
                error => {
                    if(error.response.status == 404){
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
