import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ProdutosModel } from "./produtos-model";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new ProdutosModel(page, page.navigationContext.id_categoria);
}

