import { EventData } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as dialogs from "tns-core-modules/ui/dialogs";

export function navigatingTo(args: EventData) {
	
}

export function goClientes(args: EventData) {
	topmost().navigate("views/menu/tabs/pedidos/clientes/clientes-page");
}

export function goHistorico(args: EventData) {
	topmost().navigate({moduleName: "views/menu/tabs/pedidos/historico/historico-page", clearHistory: true});
}

export function loaded(args) {
	args.object.frame.page.bindingContext.focusColetor();
	//console.log('LOADED PEDIDOS');
}

export function backEvent(args) {
	args.cancel = true;
	dialogs.confirm({
		title: "",
		message: "Deseja realmente fechar o aplicativo? ",
		okButtonText: "Sair",
		cancelButtonText: "Cancelar",
		neutralButtonText: ""
	}).then(function (result) {
		if(result){
			// @ts-ignore
			java.lang.System.exit(0);
		}
	});
}