import { Observable } from "tns-core-modules/data/observable";
import * as cache from "tns-core-modules/application-settings";

export class MainModel extends Observable {

	public default_page: string;

	constructor() {
		super();
		var api = cache.getString('api', null);
		var url = cache.getString('url', null);
		var login = cache.getString('login', null);
		var senha = cache.getString('senha', null);

		console.log(cache.getString('login'));
		console.log(cache.getString('senha'));
		console.log(cache.getString('api'));
		console.log(cache.getString('url'));
		console.log('=============');
		if(api && url && login && senha){
			this.default_page = 'views/menu/menu-page';
		} else {
			this.default_page = 'views/login/login-page';
		}
		
	}
}
// http://192.168.43.157 app@app.com.br  123456
