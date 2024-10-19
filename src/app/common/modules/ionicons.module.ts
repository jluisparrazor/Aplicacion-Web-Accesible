import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
       
})
export class IoniconsModule {
    constructor(){
        this.init();
    }

    init(){
        for(const key in icons){
         if(Object.prototype.hasOwnProperty.call(icons, key)){
            const name = key as keyof typeof icons;
            console.log(key, '  ', icons[name])
            addIcons({[key]: icons[name]});
         }
        }
    }
}