import { InterfaceButton } from "../interface/InterfaceButton";
import { KillButton } from "../interface/KillButton";
import { Context } from "../main";
import { createPickup, Item } from "./Item";

let clear: (() => void) | undefined = undefined

export const knife: Item = {
    icon: "KNIFE_ICON",
    iconFrame: 1,
    onEquip: async function (ctx: Context): Promise<void> {
        ctx.player.frame = 1;
        clear?.();
        const killButton = await KillButton(ctx);
        ctx.keyHints.enableHint("Drop");

        const keyDownHandler = ctx.game.onKeyDown("backspace", () => {
            const dropPosition = ctx.game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            knife.create(ctx, dropPosition);
        });

        clear = () => {
            keyDownHandler.cancel();
            ctx.keyHints.disableHint("Drop");
            killButton.clear()
        };
    },
    onUnequip: function (ctx: Context): void {
        ctx.player.frame = 0;
        clear?.();
        clear = undefined;
    },
    create: async function (ctx: Context, pos): Promise<void> {
        createPickup(ctx, this, pos)
    },
    droppedIcon: "KNIFE_ICON",
    droppedIconHighlighed: "KNIFE_ICON-highlighted"
}
