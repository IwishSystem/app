import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { ProdutoModel } from "./produto-model";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new ProdutoModel(page.navigationContext.id_produto);
}

