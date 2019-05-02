import { Observable} from "tns-core-modules/data/observable";
import * as cache from "tns-core-modules/application-settings";
import * as storage from "nativescript-localstorage";

export class MaisModel extends Observable {

	public login: string;

	constructor() {
		super(); 
		this.login = cache.getString('login', 'Sem Representante');
	}

	public loaded(args){
		this.set('login', cache.getString('login', 'Sem Representante'));	
	}

	public sair(args){
		let bindingContext = args.object.page.frame.page.bindingContext;
        bindingContext.login();	
	}

}