import { Vec2 } from "kaplay";
import { Context } from "../main";

export function createPickup(ctx: Context, item: Item, pos: Vec2) {
    const game = ctx.game;
        const pickup = ctx.map.add([
            game.tile(),
            game.sprite("KNIFE_ICON", { frame: item.droppedIconFrame }),
            game.pos(pos),
            game.anchor("center"),
            game.area(),
            game.z(0),
            "Pickup",
        ]);

        pickup.frame = item.droppedIconFrame;

        const PICKUP_RANGE = 80;
        pickup.onHoverUpdate(() => {
            if(ctx.player.pos.dist(pickup.pos) <= PICKUP_RANGE) {
                ctx.keyHints.enableHint("Grab")
                pickup.use(game.sprite("KNIFE_ICON-highlighted", { frame: item.droppedIconHighlighedFrame }));
                return;
            } else {
                pickup.use(game.sprite("KNIFE_ICON", { frame: item.droppedIconFrame }));
            }
        })
        pickup.onHoverEnd(() => {
            ctx.keyHints.disableHint("Grab")
            pickup.use(game.sprite("KNIFE_ICON", { frame: item.droppedIconFrame }));
        })
        pickup.onClick(() => {
            if(ctx.player.pos.dist(pickup.pos) <= PICKUP_RANGE) {
                ctx.inventory.addItem(item);
                pickup.destroy()
                ctx.keyHints.disableHint("Grab")
            }
        })
}

export interface Item {
    icon: string,
    iconFrame: number,
    droppedIconFrame: number,
    droppedIconHighlighedFrame: number,
    onEquip: (ctx: Context) => void,
    onUnequip: (ctx: Context) => void,
    create: (ctx: Context, pos: Vec2) => void
}
