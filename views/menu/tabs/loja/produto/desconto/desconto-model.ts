import { Observable } from "tns-core-modules/data/observable";// http://scancode.com.br/app     app@app.com.br   123456

export class DescontoModel extends Observable {

    public desconto: number;
    public desconto_max: number;

    constructor(desconto: number, desconto_max: number) {
        super();
        this.desconto = desconto;
        this.desconto_max = desconto_max;
    }

    public confirmar(args){
        const desconto = Number(this.desconto);
        if(Number.isInteger(desconto)){
            if(this.desconto_max < this.desconto){
                alert({title: "", message: "Desconto acime do permitido", okButtonText: ""});    
            } else {
                args.object.closeModal(this.desconto);
            }
        } else {
            alert({title: "", message: "Número não inteiro", okButtonText: ""});
        }
    }

}
// http://192.168.0.19 app@app.com.br