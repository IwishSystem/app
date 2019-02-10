import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { MaisModel } from "./mais-model";
import { TabView } from "tns-core-modules/ui/tab-view";
import { topmost } from "tns-core-modules/ui/frame";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new MaisModel();
}

export function backEvent(args) {
	args.cancel = true;
	var tab = <TabView>topmost().currentPage.parent.parent.parent;
	tab.selectedIndex = 1;
}