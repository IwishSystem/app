import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { MenuModel } from "./menu-model";
import axios from "axios";
import * as cache from "tns-core-modules/application-settings";
import * as storage from "nativescript-localstorage";




export function navigatingTo(args) {
    let page = <Page>args.object;
    page.bindingContext = new MenuModel(page);
}