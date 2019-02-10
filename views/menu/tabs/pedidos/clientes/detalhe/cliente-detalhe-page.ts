import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ClienteDetalheModel } from "./cliente-detalhe-model";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new ClienteDetalheModel(page.navigationContext.id_cliente);
}

