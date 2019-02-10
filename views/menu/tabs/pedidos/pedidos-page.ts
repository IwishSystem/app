import { EventData } from "tns-core-modules/data/observable";
import { topmost } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";

export function navigatingTo(args: EventData) {
	
}

export function goClientes(args: EventData) {
	topmost().navigate("views/menu/tabs/pedidos/clientes/clientes-page");
}

export function goHistorico(args: EventData) {
	topmost().navigate({moduleName: "views/menu/tabs/pedidos/historico/historico-page", clearHistory: true});
}

export function loaded(args) {
	//console.log('LOADED PEDIDOS');
}

export function backEvent(args) {
	args.cancel = true;
	var tab = <TabView>topmost().currentPage.parent.parent.parent;
	tab.selectedIndex = 0;
}