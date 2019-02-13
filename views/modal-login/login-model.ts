import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {LoadingIndicator} from "nativescript-loading-indicator-new"; 

export class LoginModel extends Observable {

    public loader;
    public loader_options;    

    public login: string;
    public senha: string;

    constructor() {
        super();

        this.login = '';
        this.senha = '';

        this.loader = new LoadingIndicator();
        this.loader_options =  {
            message: 'Autenticando...',
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
    }   

    public auth(args) {

                this.loader.show(this.loader_options);
        axios.get(cache.getString('api') +'/representantes/login', {auth: {username: this.login, password: this.senha}}).then(
            (result) => {
                this.loader.hide();
                if(result.status == 200){
                    cache.setString('login', this.login);
                    cache.setString('senha', this.senha);
                    cache.setNumber('id_representante', result.data.representante.id_representante);
                    args.object.closeModal();
                } else {
                    alert({title: "", message: "Configure a URL", okButtonText: ""}); 
                }
            },
            (error) => {
                this.loader.hide();
                if(error.response.status == 404){
                    alert({title: "", message: "Configure a URL", okButtonText: ""});
                } else if(error.response.status == 401) { 
                    alert({title: "", message: "Login inválido", okButtonText: ""});
                } else {
                    alert({title: "", message: "Servidor não responde", okButtonText: ""});
                }
            });
    }

    public updateUrl(){
        let url = cache.getString('url', '');
        dialogs.prompt("Configurar URL", url).then(r => {
            if(r.result){
                cache.setString('url', r.text.trim());
                cache.setString('api', r.text.trim()+'/api');
            }
        });
    }

}
