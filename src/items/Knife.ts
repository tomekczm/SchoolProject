import { KillButton } from "../interface/KillButton";
import { Context } from "../main";
import { Item } from "./Item";

let clear: (() => void) | undefined = undefined

export const knife: Item = {
    icon: "KNIFE_ICON",
    iconFrame: 1,
    onEquip: async function (ctx: Context): Promise<void> {
        clear?.();
        clear = (await KillButton(ctx)).clear;
    },
    onUnequip: function (ctx: Context): void {
       clear?.();
       clear = undefined;
    }
}