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
        const useButton = await InterfaceButton(ctx);
        useButton.enable();
        useButton.text.frame = 1;

        useButton.background.onClick(() => {
            clr?.();
            createBloodPool(ctx, ctx.player.pos);
            ctx.inventory.consume();
            ctx.player.frame = 0;
            ctx.game.debug.log("Zużyłeś wino");
        });

        const dropButton = await InterfaceButton(ctx, 400);
        dropButton.enable();
        dropButton.text.frame = 3;
        dropButton.background.onClick(() => {
            const dropPosition = game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            void wine.create(ctx, dropPosition);
        });

        clr = () => {
            useButton.clear();
            dropButton.clear();
        };
    },
    onUnequip: function (ctx: Context): void {
       clr?.();
       ctx.player.frame = 0;
       
       clr = undefined;
    },
    create: async function (ctx: Context, pos): Promise<void> {
        const game = ctx.game;
        const pickup = ctx.map.add([
            game.sprite("KNIFE_ICON"),
            game.pos(pos),
            game.anchor("center"),
            game.area(),
            game.z(0),
            "Pickup",
        ]);
        pickup.frame = 0;

        const PICKUP_RANGE = 80;
        let pickupButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        let isCreatingButton = false;

        pickup.onUpdate(() => {
            const isPlayerNearby = pickup.pos.dist(ctx.player.pos) <= PICKUP_RANGE;

            if (!isPlayerNearby) {
                pickupButton?.clear();
                pickupButton = undefined;
                pickup.use(game.sprite("KNIFE_ICON", { frame: 0 }));
                return;
            }

            if (pickupButton || isCreatingButton) return;
            isCreatingButton = true;

            void InterfaceButton(ctx, 200).then((button) => {
                if (pickup.pos.dist(ctx.player.pos) > PICKUP_RANGE) {
                    button.clear();
                    return;
                }

                pickup.use(game.sprite("KNIFE_ICON-highlighted", { frame: 0 }));
                pickupButton = button;
                button.enable();
                button.text.frame = 2;
                button.background.onClick(() => {
                    pickupButton?.clear();
                    pickupButton = undefined;
                    ctx.inventory.setSlot(1, wine);
                    pickup.destroy();
                });
            }).finally(() => {
                isCreatingButton = false;
            });
        });
    }
}