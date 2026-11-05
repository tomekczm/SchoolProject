import { Vec2 } from "kaplay";
import { Context } from "../main";

export interface Item {
    icon: string,
    iconFrame: number,
    onEquip: (ctx: Context) => void,
    onUnequip: (ctx: Context) => void,
    create: (ctx: Context, pos: Vec2) => void
}
