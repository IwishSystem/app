import { Observable } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import * as orientation from "nativescript-orientation";
import { DrawingPad } from 'nativescript-drawingpad';
import * as storage from "nativescript-localstorage";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";
import {LoadingIndicator} from "nativescript-loading-indicator-new"; 

export class AssinaturaModel extends Observable {

    public pedido;

    public loader;
    public loader_options;    

    constructor() {
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
        this.pedido = storage.getItem('pedido');

    }

    public loaded(){
        orientation.setOrientation("landscape");  
        orientation.disableRotation();
    }

    public unloaded(){
        orientation.enableRotation();
    }

    public salvar (args) {
        var ImageSourceModule = require('image-source');
        let drawingPad = <DrawingPad>topmost().getViewById('assinatura');
        drawingPad.getDrawing().then((desenho) => {

            var image = ImageSourceModule.fromNativeSource( desenho );
            var base64 = image.toBase64String();
            var page = args.object.page;


            this.loader.show(this.loader_options);
            axios.patch(cache.getString('api') + '/pedidos/'+this.pedido.id_pedido+'/update',{assinatura_cliente: base64, id_status: 2}, {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
                (result) => {
                    if(result.status == 200) {
                        topmost().navigate("views/menu/tabs/pedidos/pedido/sucesso/sucesso-page");
                    } else {
                        this.redirectLogin(page);
                    }
                    this.loader.hide();
                },
                (error) => {
                    if(error.response.status == 404 || error.response.status == 401){
                        this.redirectLogin(page);
                    } else {
                        alert({title: "", message: 'Opps,Ocorreu alguma falha ', okButtonText: ''});
                    }
                    this.loader.hide();
                });
        });
    }

    private redirectLogin(page){
        var frame = page.parent.parent.parent.parent.frame;
        frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
    }

}
