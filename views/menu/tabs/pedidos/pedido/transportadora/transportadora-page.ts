import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { TransportadoraModel } from "./transportadora-model";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new TransportadoraModel();
}

