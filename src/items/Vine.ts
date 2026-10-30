import { Vec2 } from "kaplay";
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
        ctx.player.frame = 2;
        clr?.();
        const game = ctx.game;
        const { background, enable, disable, text, clear } = await InterfaceButton(ctx);
        enable();
        text.frame = 1;

        background.onClick(() => {
            clr?.();
            createBloodPool(ctx, ctx.player.pos);
            ctx.inventory.consume();
            ctx.player.frame = 0;
        });
        clr = clear;
    },
    onUnequip: function (ctx: Context): void {
        clr?.();
        ctx.player.frame = 0;
        clr = undefined;
    },
    create: function (ctx: Context, pos: Vec2): void {
        // This item does not have a specific creation behavior in the game world.
    }
}