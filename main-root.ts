import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { MainModel } from "./main-model";

export function loaded(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new MainModel();
}
