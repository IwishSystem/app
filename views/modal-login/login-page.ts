import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { LoginModel } from "./login-model";
import * as cache from "tns-core-modules/application-settings";


export function onShownModally(args) {
	const modal = args.object;
	const context = args.context;
    modal.bindingContext = new LoginModel();

}
