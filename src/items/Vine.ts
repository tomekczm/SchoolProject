import { createBloodPool } from "../effects/BloodPool";
import { InterfaceButton } from "../interface/InterfaceButton";
import { Context } from "../main";
import { createPickup, Item } from "./Item";

const INTERACTION_RANGE = 80;
let clearEquippedState: (() => void) | undefined;

export const wine: Item = {
    icon: "KNIFE_ICON",
    iconFrame: 0,
    droppedIconFrame: 0,
    droppedIconHighlighedFrame: 0,
    onEquip: async function (ctx: Context): Promise<void> {
        const game = ctx.game;
        clearEquippedState?.();
        let isEquipped = true;
        let useButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        let dropKeyHandler: ReturnType<typeof game.onKeyDown> | undefined;
        clearEquippedState = () => {
            isEquipped = false;
            useButton?.clear();
            dropKeyHandler?.cancel();
            ctx.keyHints.disableHint("Drop");
        };

        ctx.player.frame = 2;

        game.onKeyPress("e", () => {
            if (!isEquipped || ctx.player.hidden) return;
            clearEquippedState?.();
            createBloodPool(ctx, ctx.player.pos, false);
            ctx.inventory.consume();
            ctx.player.frame = 0;
            ctx.logger.Log("Zużyłeś wino");
        });

        ctx.keyHints.enableHint("Drop");
        dropKeyHandler = game.onKeyDown("backspace", () => {
            if (!isEquipped || ctx.player.hidden) return;
            const dropPosition = game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            void wine.create(ctx, dropPosition);
        });
    },
    onUnequip: function (ctx: Context): void {
        clearEquippedState?.();
        clearEquippedState = undefined;
        ctx.player.frame = 0;
    },
    create: async function (ctx: Context, pos): Promise<void> {
            createPickup(ctx, this, pos)
        },
};
