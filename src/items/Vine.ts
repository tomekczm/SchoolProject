import { createBloodPool } from "../effects/BloodPool";
import { InterfaceButton } from "../interface/InterfaceButton";
import { KillButton } from "../interface/KillButton";
import { Context } from "../main";
import { Item } from "./Item";

let clr: (() => void) | undefined = undefined

export const wine: Item = {
    icon: "KNIFE_ICON",
    iconFrame: 0,
    onEquip: async function (ctx: Context): Promise<void> {
        clr?.();
        const game = ctx.game;
        const { background, enable, disable, text, clear } = await InterfaceButton(ctx);
        enable()
        text.frame = 1;

        background.onClick(() => {
            clr?.();
            createBloodPool(ctx, ctx.player.pos)
        })

        clr = clear;
    },
    onUnequip: function (ctx: Context): void {
       clr?.();
       clr = undefined;
    }
}