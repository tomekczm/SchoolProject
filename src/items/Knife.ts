import { InterfaceButton } from "../interface/InterfaceButton";
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
        const killButton = await KillButton(ctx);
        const dropButton = await InterfaceButton(ctx, 200);
        dropButton.enable();
        dropButton.text.frame = 3;
        dropButton.background.onClick(() => {
            const dropPosition = ctx.game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            void knife.create(ctx, dropPosition);
        });
        clear = () => {
            killButton.clear();
            dropButton.clear();
        };
    },
    onUnequip: function (ctx: Context): void {
        ctx.player.frame = 0;
        clear?.();
        clear = undefined;
    },
    create: async function (ctx: Context, pos): Promise<void> {
        const game = ctx.game;
        const pickup = ctx.map.add([
            game.sprite("KNIFE_ICON"),
            game.pos(pos),
            game.anchor("center"),
            game.area(),
            game.z(2),
            "Pickup",
        ]);

        pickup.frame = 1;

        const PICKUP_RANGE = 80;
        let pickupButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        let isCreatingButton = false;

        pickup.onUpdate(() => {
            const isPlayerNearby = pickup.pos.dist(ctx.player.pos) <= PICKUP_RANGE;

            if (!isPlayerNearby) {
                pickupButton?.clear();
                pickupButton = undefined;
                pickup.use(game.sprite("KNIFE_ICON", { frame: 1 }));
                return;
            }

            if (pickupButton || isCreatingButton) return;
            isCreatingButton = true;

            void InterfaceButton(ctx, 200).then((button) => {
                if (pickup.pos.dist(ctx.player.pos) > PICKUP_RANGE) {
                    button.clear();
                    return;
                }
                pickup.use(game.sprite("KNIFE_ICON-highlighted", { frame: 1 }));
                pickupButton = button;
                button.enable();
                button.text.frame = 2;
                button.background.onClick(() => {
                    pickupButton?.clear();
                    pickupButton = undefined;
                    ctx.inventory.setSlot(0, knife);
                    pickup.destroy();
                });
            }).finally(() => {
                isCreatingButton = false;
            });
        });
    }
}