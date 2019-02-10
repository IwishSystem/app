import { Observable , PropertyChangeData} from "tns-core-modules/data/observable";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";
import * as storage from "nativescript-localstorage";
import { topmost, Frame } from "tns-core-modules/ui/frame";
import { TabView } from "tns-core-modules/ui/tab-view";
import * as cache from "tns-core-modules/application-settings";
import {SearchBar} from "ui/search-bar";
import axios from "axios";

import { RadListView } from 'nativescript-ui-listview';

import {TextView} from "ui/text-view";

import {isAndroid} from "platform";

export class SacolaModel extends Observable {

	public page;
	public pedido;
	public items;

	constructor(page) {
		super(); 
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
		tab.selectedIndex = 3;

	}


	/*public searchProduto(search){
		var page = topmost().currentPage;
		axios.get(cache.getString("api") + "/produtos/"+search+"/find", {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
			result => {
				if(result.status == 200) {

					var produto = result.data.produto;
					if(produto){
						var frameLoja= <Frame>topmost().currentPage.parent.parent.parent.parent.getViewById('loja_frame');
						frameLoja.navigate({moduleName: "views/menu/tabs/loja/produto/produto-page", backstackVisible: false, context: { id_produto: produto.id_produto }});
						
						var tab = <TabView>topmost().currentPage.parent.parent.parent;
						tab.selectedIndex = 3;
					} else {
						alert({title: "", message: "Produto não encontrado ", okButtonText: ""});
					}

				} else {
					this.redirectLogin(page);
				}
			},
			error => {
				alert(error.response.status);
				if(error.response.status == 404 || error.response.status == 401){
					this.redirectLogin(page);
				} else {
					alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
				}
			});
	}*/ 

	private redirectLogin(page){
		var frame = page.parent.parent.parent.parent.frame;
		frame.navigate({moduleName: "views/login/login-page", clearHistory: true});
	}


	public deleteItem(args){
		//console.log(topmost().currentPage);
		//console.log(this.page);
		const listView = <RadListView>this.page.getViewById("listView");
		//console.log('NODE: '+listView);


		listView.notifySwipeToExecuteFinished();
		const viewModel = listView.bindingContext;
		console.log(cache.getString('api') + '/pedidos/'+this.pedido.id_pedido+'/pedido_item/'+args.object.bindingContext.id+'/destroy');

		axios.delete(cache.getString('api') + '/pedidos/'+this.pedido.id_pedido+'/pedido_item/'+args.object.bindingContext.id+'/destroy', {auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
			result => {
				if(result.status == 200) {
					storage.setItemObject('pedido', result.data.pedido);
					const viewMode = listView.bindingContext;
					viewModel.items.splice(viewModel.items.indexOf(args.object.bindingContext), 1);



				} else {
					this.redirectLogin(this.page);
				}
			},
			error => {
				alert(error.response.status);
				if(error.response.status == 404 || error.response.status == 401){
					this.redirectLogin(this.page);
				} else {
					alert({title: "", message: "Opps,Ocorreu alguma falha", okButtonText: ""});
				}
			});
	}

}
//http://192.168.0.19 app@app.com.br 123456
