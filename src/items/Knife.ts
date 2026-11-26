import { InterfaceButton } from "../interface/InterfaceButton";
import { KillButton } from "../interface/KillButton";
import { Context } from "../main";
import { createPickup, Item } from "./Item";

let clear: (() => void) | undefined = undefined

export const knife: Item = {
    icon: "KNIFE_ICON",
    iconFrame: 1,
    droppedIconFrame: 1,
    droppedIconHighlighedFrame: 1,
    onEquip: async function (ctx: Context): Promise<void> {
        ctx.player.frame = 1;
        clear?.();
        let isEquipped = true;
        ctx.keyHints.enableHint("Drop");

        const keyDownHandler = ctx.game.onKeyDown("backspace", () => {
            if(!isEquipped || ctx.player.hidden) return;
            const dropPosition = ctx.game.vec2(ctx.player.pos.x, ctx.player.pos.y);
            ctx.inventory.dropEquipped();
            knife.create(ctx, dropPosition);
        });
        const killButton = KillButton(ctx);

        clear = () => {
            isEquipped = false;
            keyDownHandler.cancel();
            killButton.clear();
            ctx.keyHints.disableHint("Drop");
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
    
}
