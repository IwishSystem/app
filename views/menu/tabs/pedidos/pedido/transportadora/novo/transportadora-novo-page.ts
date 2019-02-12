import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { TransportadoraNovoModel } from "./transportadora-novo-model";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
    page.bindingContext = new TransportadoraNovoModel();
}
