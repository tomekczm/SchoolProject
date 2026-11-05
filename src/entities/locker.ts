import { Context } from "../main";

export const createLocker = (ctx: Context, pos: any) => {
    const game = ctx.game;
    const locker = ctx.map.add([
        game.sprite("Locker", { frame: 0 }),
        game.pos(pos),
        game.area(),
        game.z(4),
        "Wall",
        "Locker",
    ]);
    const USE_RANGE = 80;
    let playerInLocker = false;

    locker.onUpdate(() => {
        const isPlayerNearby = locker.pos.dist(ctx.player.pos) <= USE_RANGE;

        if (!isPlayerNearby) {
            locker.use(game.sprite("Locker", { frame: 0 }));
            return;
        }
        locker.use(game.sprite("Locker", { frame: 1 }));
    });

    game.onKeyPress("e", () => {
        if (playerInLocker) {
            playerInLocker = false;
            ctx.player.hidden = false;
            return;
        }

        if (locker.pos.dist(ctx.player.pos) <= USE_RANGE) {
            playerInLocker = true;
            ctx.player.hidden = true;
            game.setCamPos(pos.x+16, pos.y+32);
        }
    });

    return locker;
}