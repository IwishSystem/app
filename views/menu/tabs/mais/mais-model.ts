import { Observable} from "tns-core-modules/data/observable";
import * as cache from "tns-core-modules/application-settings";
import * as storage from "nativescript-localstorage";

export class MaisModel extends Observable {

	constructor() {
		super(); 
	}

	public sair(args){
		
		const main_frame = args.object.page.parent.page.frame;
		const pedidos_frame = main_frame.getViewById('pedidos_frame');
		const tabview = main_frame.getViewById('tabViewContainer');
		const page_menu = main_frame.getViewById('page_menu');
		
		console.log(pedidos_frame);
		console.log(pedidos_frame);

		pedidos_frame.navigate({moduleName: "views/menu/tabs/pedidos/pedidos-page", clearHistory: true});
		tabview.selectedIndex = 0;


		var bindingContext = page_menu.bindingContext;
        bindingContext.login();	
	}

}