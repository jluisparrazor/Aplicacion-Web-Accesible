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
    constructor(){}

    // init(requiredIcons: (keyof typeof icons)[]) {
    //     requiredIcons.forEach(iconName => {
    //         if (icons[iconName]) {
    //             addIcons({ [iconName]: icons[iconName] });
    //         } else {
    //             console.warn(`El ícono "${iconName}" no existe en la librería de Ionicons.`);
    //         }
    //     });
    // }
}