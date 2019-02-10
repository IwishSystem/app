import { EventData, fromObject } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { HistoricoModel } from "./historico-model";
import { topmost } from "tns-core-modules/ui/frame";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new HistoricoModel();
}


export function backEvent(args) {
	args.cancel = true;
	topmost().navigate({moduleName: "views/menu/tabs/pedidos/pedidos-page", clearHistory: true});
}