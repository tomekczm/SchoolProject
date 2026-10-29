import { KillButton } from "../interface/KillButton";
import { Context } from "../main";
import { Item } from "./Item";

let clear: (() => void) | undefined = undefined

export const knife: Item = {
    icon: "KNIFE_ICON",
    iconFrame: 1,
    onEquip: async function (ctx: Context): Promise<void> {
        ctx.player.frame = 1;
        clear?.();
        clear = (await KillButton(ctx)).clear;
    },
    onUnequip: function (ctx: Context): void {
       ctx.player.frame = 0;
       clear?.();
       clear = undefined;
    }
}