import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { Frame, getFrameById, topmost } from "tns-core-modules/ui/frame";
import { HomeModel } from "./home-model";
import * as dialogs from "tns-core-modules/ui/dialogs";


export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new HomeModel();
}

export function backEvent(args) {
	args.cancel = true;
	dialogs.confirm({
		title: "",
		message: "Deseja realmente fechar o aplicativo? ",
		okButtonText: "Sair",
		cancelButtonText: "Cancelar",
		neutralButtonText: ""
	}).then(function (result) {
		if(result){
			// @ts-ignore
			java.lang.System.exit(0);
		}
	});
}