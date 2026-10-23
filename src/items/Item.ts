import { Context } from "../main";

export interface Item {
    icon: string,
    iconFrame: number,
    onEquip: (ctx: Context) => void,
    onUnequip: (ctx: Context) => void,
}