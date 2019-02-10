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
	tab.selectedIndex = 1;
}

export function updateSacola(page: Page) {

	console.log(page);
//	var page = <Page>topmost().currentPage;
//	console.log(page.frame);
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

export function onLeftSwipeClick(args) {
    /*const listView = <RadListView>topmost().currentPage.getViewById("listView");
    console.log("Left swipe click");
    listView.notifySwipeToExecuteFinished();*/
}

export function onRightSwipeClick(args) {
    /*const listView = <RadListView>topmost().currentPage.getViewById("listView");
    console.log("Right swipe click");
    const viewModel: ViewModel = <ViewModel>listView.bindingContext;
    viewModel.items.splice(viewModel.items.indexOf(args.object.bindingContext), 1);*/
}