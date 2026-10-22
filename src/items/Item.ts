import { Globals } from "../main";

export interface Item {
    icon: string,
    iconFrame: number,
    onEquip: (ctx: Globals) => void,
    onUnequip: (ctx: Globals) => void,
}