import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { LoginModel } from "./login-model";
import * as cache from "tns-core-modules/application-settings";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new LoginModel();
}