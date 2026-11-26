import { GameObj, PosComp, Vec2 } from "kaplay";
import { Context } from "../main";
import { createPickup, Item } from "./Item";

const POISON_FRAME = 2;
const POISON_SLOT = 2;
const INTERACTION_RANGE = 80;

let clearEquippedState: (() => void) | undefined;

export const poison: Item = {
    icon: "KNIFE_ICON",
    iconFrame: POISON_FRAME,
    droppedIconFrame: 2,
    droppedIconHighlighedFrame: 2,
    onEquip: async function (ctx: Context): Promise<void> {
        const game = ctx.game;
        clearEquippedState?.();
        let isEquipped = true;
        const dropKeyHandler = game.onKeyDown("backspace", () => {
            if (!isEquipped || ctx.player.hidden) return;
            const dropPosition = game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            void poison.create(ctx, dropPosition);
        });

        const useKey = game.onKeyPress("e", () => {
            if (!isEquipped || ctx.player.hidden) return;

            const wineGlasses = ctx.map.get("WineGlass") as GameObj<PosComp>[];
            const wineGlass = wineGlasses.find(
                (glass) => glass.pos.dist(ctx.player.pos) <= INTERACTION_RANGE,
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
            wineGlass.use(game.sprite("Wine_Entity", { frame: 2 }));
            ctx.logger.Log("Zatrułeś wino");
            clearEquippedState?.();
            clearEquippedState = undefined;
            ctx.inventory.consume();
            
        });

        clearEquippedState = () => {
            isEquipped = false;
            useKey.cancel();
            dropKeyHandler.cancel();
            ctx.keyHints.disableHint("Drop");
        };

        ctx.keyHints.enableHint("Drop");
    },
    onUnequip: function (ctx: Context): void {
        clearEquippedState?.();
        clearEquippedState = undefined;
    },
    create: async function (ctx: Context, pos): Promise<void> {
            createPickup(ctx, this, pos)
        },
};
