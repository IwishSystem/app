import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { QuantidadeModel } from "./quantidade-model";

export function onShownModally(args) {
	const modal = args.object;
	const context = args.context;
    modal.bindingContext = new QuantidadeModel(context.quantidade, context.min, context.max, context.multiplo);
}

