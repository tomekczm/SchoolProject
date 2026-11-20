import { Vec2 } from "kaplay";
import { Context } from "../main";

interface Pickup {
    defaultIcon: string,

}

export function createPickup(ctx: Context, item: Item, pos: Vec2) {
    const game = ctx.game;
        const pickup = ctx.map.add([
            game.tile(),
            game.sprite(item.droppedIcon),
            game.pos(pos),
            game.anchor("center"),
            game.area(),
            game.z(0),
            "Pickup",
        ]);

        pickup.frame = 1;

        const PICKUP_RANGE = 80;
        pickup.onHoverUpdate(() => {
            if(ctx.player.pos.dist(pickup.pos) <= PICKUP_RANGE) {
                ctx.keyHints.enableHint("Grab")
                pickup.use(game.sprite(item.droppedIconHighlighed, { frame: 1 }));
                return;
            } else {
                pickup.use(game.sprite(item.droppedIcon, { frame: 1 }));
            }
        })
        pickup.onHoverEnd(() => {
            ctx.keyHints.disableHint("Grab")
            pickup.use(game.sprite(item.droppedIcon, { frame: 1 }));
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
    droppedIcon: string,
    droppedIconHighlighed: string,
    onEquip: (ctx: Context) => void,
    onUnequip: (ctx: Context) => void,
    create: (ctx: Context, pos: Vec2) => void
}
