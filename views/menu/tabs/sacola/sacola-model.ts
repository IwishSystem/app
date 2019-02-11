import { Observable , PropertyChangeData} from "tns-core-modules/data/observable";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";
import * as storage from "nativescript-localstorage";
import { topmost, Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as cache from "tns-core-modules/application-settings";
import {SearchBar} from "ui/search-bar";
import axios from "axios";
import {LoadingIndicator} from "nativescript-loading-indicator-new";

import { RadListView } from 'nativescript-ui-listview';

import {TextView} from "ui/text-view";

import {isAndroid} from "platform";

export class SacolaModel extends Observable {

	public loader;
	public loader_options;

	public page;
	public pedido;
	public items;

	constructor(page) {
		super(); 
		this.loader = new LoadingIndicator();
		this.loader_options =  {
			message: 'Removendo da Sacola...',
			progress: 0.65,
			android: {
				indeterminate: true,
				cancelable: false,
				max: 100,
				progressNumberFormat: "%1d/%2d",
				progressPercentFormat: 0.53,
				progressStyle: 1,
				secondaryProgress: 1
			},
			ios: {
				details: "Additional detail note!",
				square: false,
				margin: 10,
				dimBackground: true,
				color: "#4B9ED6"
			}
		};
		this.page = page;
		this.items = new ObservableArray();
		this.pedido = null;
	}

	public loaded(args){
		this.set('pedido', storage.getItem('pedido'));
		if(this.pedido){
			var items = new ObservableArray(...this.pedido.pedido_itens);
			this.set('items', items);
		}
	}

	public setPedido(){
		this.set('pedido', storage.getItem('pedido'));
		if(this.pedido){
			var items = new ObservableArray(...this.pedido.pedido_itens);
			this.set('items', items);
		}		
	}


	public gotoProduto(args){
		var frameSacola = <Frame>topmost().currentPage.parent.parent.parent.parent.getViewById('loja_frame');
		frameSacola.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: args.view.bindingContext.produto.id_produto }});
		var tab = <TabView>topmost().currentPage.parent.parent.parent;
		tab.selectedIndex = 2;

	}


	private redirectLogin(page){
		var frame = page.parent.parent.parent.parent.frame;
		frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
	}


	public deleteItem(args){
		const listView = <RadListView>this.page.getViewById("listView");
		listView.notifySwipeToExecuteFinished();
		const viewModel = listView.bindingContext;

		this.loader.show(this.loader_options);
		axios.delete(cache.getString('api') + '/pedidos/'+this.pedido.id_pedido+'/pedido_item/'+args.object.bindingContext.id+'/destroy', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
			result => {
				if(result.status == 200) {
					storage.setItemObject('pedido', result.data.pedido);
					const viewMode = listView.bindingContext;
					viewModel.items.splice(viewModel.items.indexOf(args.object.bindingContext), 1);
				} else {
					this.redirectLogin(this.page);
				}
				this.loader.hide();
			},
			error => {
				alert(error.response.status);
				if(error.response.status == 404 || error.response.status == 401){
					this.redirectLogin(this.page);
				} else {
					alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
				}
				this.loader.hide();
			});
	}

}