import { Observable} from "tns-core-modules/data/observable";
import * as cache from "tns-core-modules/application-settings";
import * as storage from "nativescript-localstorage";

export class MaisModel extends Observable {

	constructor() {
		super(); 
	}

	public sair(args){
		let bindingContext = args.object.page.frame.page.bindingContext;
        bindingContext.login();	
	}

}