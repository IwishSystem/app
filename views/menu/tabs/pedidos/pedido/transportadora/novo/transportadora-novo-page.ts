import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { TransportadoraNovoModel } from "./transportadora-novo-model";
import { topmost } from "tns-core-modules/ui/frame";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new TransportadoraNovoModel();
}

export function backEvent(args) {
	args.cancel = true;
	topmost().navigate({moduleName: "views/menu/tabs/pedidos/pedido/pedido-page", clearHistory: true});
}