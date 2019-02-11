import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { SacolaModel } from "./sacola-model";
import { topmost } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";


export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new SacolaModel(page);
}

export function backEvent(args) {
	args.cancel = true;
	var tab = <TabView>topmost().currentPage.parent.parent.parent;
	tab.selectedIndex = 0;
}

export function updateSacola(page: Page) {

}

export function onSwipeCellStarted(args) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args.object;
    const leftItem = swipeView.getViewById('mark-view');
    const rightItem = swipeView.getViewById('delete-view');
    swipeLimits.left = leftItem.getMeasuredWidth();
    swipeLimits.right = rightItem.getMeasuredWidth();
    swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
}