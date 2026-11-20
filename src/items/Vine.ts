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
        clearEquippedState?.();
        let isEquipped = true;
        let useButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        let dropButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        clearEquippedState = () => {
            isEquipped = false;
            useButton?.clear();
            dropButton?.clear();
        };

        ctx.player.frame = 2;
        const game = ctx.game;
        const createdUseButton = await InterfaceButton(ctx);
        useButton = createdUseButton;
        if (!isEquipped) {
            createdUseButton.clear();
            return;
        }
        createdUseButton.enable();
        createdUseButton.text.frame = 1;

        createdUseButton.background.onClick(() => {
            if (!isEquipped || ctx.player.hidden) return;
            clearEquippedState?.();
            createBloodPool(ctx, ctx.player.pos, false);
            ctx.inventory.consume();
            ctx.player.frame = 0;
            ctx.logger.Log("Zużyłeś wino");
        });

        const createdDropButton = await InterfaceButton(ctx, 400);
        dropButton = createdDropButton;
        if (!isEquipped) {
            createdDropButton.clear();
            return;
        }
        createdDropButton.enable();
        createdDropButton.text.frame = 3;
        createdDropButton.background.onClick(() => {
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
