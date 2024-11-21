import { Timestamp } from "firebase/firestore";

export interface MenuType{
    id: string;
    name: string;
    pictogramId: string;
    visible: boolean;
}

export interface Menu{
    id: string;
    date: Timestamp;
    menus: {
        [className: string]: {
          [menuTypeName: string]: number;
        };
      };
}
