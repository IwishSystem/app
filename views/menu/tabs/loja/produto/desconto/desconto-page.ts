import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { DescontoModel } from "./desconto-model";

export function onShownModally(args) {
	const modal = args.object;
	const context = args.context;
    modal.bindingContext = new DescontoModel(context.desconto, context.desconto_max);
}

