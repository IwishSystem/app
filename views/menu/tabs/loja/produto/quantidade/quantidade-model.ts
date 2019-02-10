import { Observable } from "tns-core-modules/data/observable";// http://scancode.com.br/app     app@app.com.br   123456

export class QuantidadeModel extends Observable {

    public quantidade: number;
    public min: number;
    public max: number;
    public multiplo: number;

    constructor(quantidade: number, min: number, max: number, multiplo: number) {
        super();
        this.quantidade = quantidade;
        this.min = min;
        this.max = max;
        this.multiplo = multiplo;
    }

    public confirmar(args){
        //alert(quantidade%this.multiplo);
        const quantidade = Number(this.quantidade);
        if(Number.isInteger(quantidade)){
            if(quantidade <= this.max && quantidade >= this.min && quantidade%this.multiplo==0) {
                args.object.closeModal(this.quantidade);
            } else {
                alert({title: "", message: "Quantidade inválida", okButtonText: ""});
            }
        } else {
            alert({title: "", message: "Número não inteiro", okButtonText: ""});
        }
    }

}
