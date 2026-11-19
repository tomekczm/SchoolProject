import { GameObj, PosComp, Vec2 } from "kaplay";
import { InterfaceButton } from "../interface/InterfaceButton";
import { Context } from "../main";
import { Item } from "./Item";

const POISON_FRAME = 2;
const POISON_SLOT = 2;
const USE_RANGE = 80;
const PICKUP_RANGE = 80;

let clearEquippedState: (() => void) | undefined;

export const poison: Item = {
    icon: "KNIFE_ICON",
    iconFrame: POISON_FRAME,
    onEquip: async function (ctx: Context): Promise<void> {
        const game = ctx.game;
        clearEquippedState?.();
        let isEquipped = true;
        let dropButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;

        const useKey = game.onKeyPress("e", () => {
            if (!isEquipped || ctx.player.hidden) return;

            const wineGlasses = ctx.map.get("WineGlass") as GameObj<PosComp>[];
            const wineGlass = wineGlasses.find(
                (glass) => glass.pos.dist(ctx.player.pos) <= USE_RANGE,
            );

            if (!wineGlass) {
                ctx.logger.Log("Musisz być bliżej kieliszka z winem, aby go zatruć");
                return;
            }

            if (wineGlass.is("Poisoned")) {
                ctx.logger.Log("To wino jest już zatrute");
                return;
            }

            wineGlass.tag("Poisoned");
            ctx.logger.Log("Zatrułeś wino");
            clearEquippedState?.();
            clearEquippedState = undefined;
            ctx.inventory.consume();
        });

        clearEquippedState = () => {
            isEquipped = false;
            useKey.cancel();
            dropButton?.clear();
        };

        dropButton = await InterfaceButton(ctx, 400);
        if (!isEquipped) {
            dropButton.clear();
            return;
        }
        dropButton.enable();
        dropButton.text.frame = 3;
        dropButton.background.onClick(() => {
            if (ctx.player.hidden) return;
            const dropPosition = game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            void poison.create(ctx, dropPosition);
        });
    },
    onUnequip: function (ctx: Context): void {
        clearEquippedState?.();
        clearEquippedState = undefined;
    },
    create: async function (ctx: Context, pos: Vec2): Promise<void> {
        const game = ctx.game;
        const pickup = ctx.map.add([
            game.tile(),
            game.sprite("KNIFE_ICON"),
            game.pos(pos),
            game.anchor("center"),
            game.area(),
            game.z(0),
            "Pickup",
        ]);
        pickup.frame = POISON_FRAME;

        let pickupButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        let isCreatingButton = false;

        pickup.onUpdate(() => {
            const isPlayerNearby = pickup.pos.dist(ctx.player.pos) <= PICKUP_RANGE;

            if (!isPlayerNearby) {
                pickupButton?.clear();
                pickupButton = undefined;
                pickup.use(game.sprite("KNIFE_ICON", { frame: POISON_FRAME }));
                return;
            }

            if (pickupButton || isCreatingButton) return;
            isCreatingButton = true;

            void InterfaceButton(ctx, 200).then((button) => {
                if (pickup.pos.dist(ctx.player.pos) > PICKUP_RANGE) {
                    button.clear();
                    return;
                }

                pickup.use(game.sprite("KNIFE_ICON-highlighted", { frame: POISON_FRAME }));
                pickupButton = button;
                button.enable();
                button.text.frame = 2;
                button.background.onClick(() => {
                    if (ctx.player.hidden) return;
                    pickupButton?.clear();
                    pickupButton = undefined;
                    ctx.inventory.setSlot(POISON_SLOT, poison);
                    pickup.destroy();
                });
            }).finally(() => {
                isCreatingButton = false;
            });
        });
    },
};
