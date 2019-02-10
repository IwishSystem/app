import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";

export class LoginModel extends Observable {

    public login: string;
    public senha: string;

    constructor() {
        super();

        this.login = '';
        this.senha = '';
    }   

    public auth(args) {
        var frame = args.object.page.frame;
        axios.get(cache.getString('api')+'/representantes/login', {auth: {username: this.login, password: this.senha}}).then(
            (result) => {
                if(result.status == 200){
                    cache.setString('login', this.login);
                    cache.setString('senha', this.senha);
                    cache.setNumber('id_representante', result.data.representante.id_representante);
                    frame.navigate({moduleName: "views/menu/menu-page", clearHistory: true});
                } else {
                    alert({title: "", message: "Configure a URL", okButtonText: ""});
                    frame.navigate("views/login/host/host-page"); 
                }
            },
            (error) => {
                if(error.response.status == 404){
                    alert({title: "", message: "Configure a URL", okButtonText: ""});
                    frame.navigate("views/login/host/host-page");
                } else if(error.response.status == 401) { 
                    alert({title: "", message: "Login inválido", okButtonText: ""});
                } else {
                    alert({title: "", message: "Servidor não responde", okButtonText: ""});
                }
            });
    }


}
