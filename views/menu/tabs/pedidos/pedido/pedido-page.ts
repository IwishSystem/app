import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { PedidoModel } from "./pedido-model";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as cache from "tns-core-modules/application-settings";
import axios from "axios";
import * as storage from "nativescript-localstorage";
import { topmost } from "tns-core-modules/ui/frame";

export function navigatingTo(args: EventData) {
	let page = <Page>args.object;
	page.bindingContext = new PedidoModel(page);
}

export function backEvent(args) {
	args.cancel = true;

	var pedido = storage.getItem('pedido');
	if(pedido.id_status == 6){	
		dialogs.action('Opções', 'Voltar', ['Cancelar Pedido', 'Reservar Pedido']).then(
			(result) => {
				switch (result) {
					case 'Cancelar Pedido': 
					console.log('cacnelar');
					axios.patch(cache.getString("api") + "/pedidos/"+pedido.id_pedido+"/update",{id_status: 3},{auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
						(result) => {
							if(result.status == 200) {
								storage.setItemObject('pedido', null);
								topmost().navigate("views/menu/tabs/pedidos/historico/historico-page");
							} else {
								//this.redirectLogin(page);
								alert({title: "", message: "Falha conexão ", okButtonText: ""});
							}
						}, (error) => {
							if(error.response.status == 404 || error.response.status == 401){
								//this.redirectLogin(page);
								alert({title: "", message: "Falha conexão ", okButtonText: ""});
							} else {
								alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
							}
						});
					break;
					case 'Reservar Pedido':
					axios.patch(cache.getString("api") + "/pedidos/"+pedido.id_pedido+"/update",{id_status: 4},{auth: {username: cache.getString('login'), password: cache.getString('senha')}}).then(
						(result) => {
							if(result.status == 200) {
								storage.setItemObject('pedido', null);
								topmost().navigate("views/menu/tabs/pedidos/historico/historico-page");
							} else {
								//this.redirectLogin(page);
								alert({title: "", message: "Falha conexão ", okButtonText: ""});
							}
						}, (error) => {
							if(error.response.status == 404 || error.response.status == 401){
								//this.redirectLogin(page);
								alert({title: "", message: "Falha conexão ", okButtonText: ""});
							} else {
								alert({title: "", message: "Opps, Ocorreu alguma falha ", okButtonText: ""});
							}
						});
					break; 
				}
			});
	} else {
		storage.setItemObject('pedido', null);
		topmost().navigate({moduleName: "views/menu/tabs/pedidos/historico/historico-page", clearHistory: true});
	}
}