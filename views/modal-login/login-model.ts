import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";
import * as dialogs from "tns-core-modules/ui/dialogs";

export class LoginModel extends Observable {

    public login: string;
    public senha: string;

    constructor() {
        super();

        this.login = '';
        this.senha = '';
    }   

    public auth(args) {

        console.log(cache.getString('api') +'/representantes/login');
        axios.get(cache.getString('api') +'/representantes/login', {auth: {username: this.login, password: this.senha}}).then(
            (result) => {
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
            console.log(r.result);
            if(r.result){
                cache.setString('url', r.text);
                cache.setString('api', r.text+'/api');
            }
        });
    }

}
