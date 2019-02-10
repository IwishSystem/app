import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";

export class LoginModel extends Observable {

    public login: string;
    public senha: string;
    public url: string;
    public api: string;

    constructor() {
        super();

        this.login = '';
        this.senha = '';
        this.url = '';
        this.api = '';
    }   

    public auth(args) {
        console.log(this.url+'/api/representantes/login');
        axios.get(this.url+'/api/representantes/login', {auth: {username: this.login, password: this.senha}}).then(
            (result) => {
                if(result.status == 200){
                    cache.setString('url', this.url);
                    cache.setString('api', this.url+'/api');
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


}
