import { Globals } from "../main";

export interface Item {
    icon: string,
    onEquip: (ctx: Globals) => void,
    onUnequip: (ctx: Globals) => void,
}