import { Vec2 } from "kaplay";
import { Context } from "../main";

const WINE_HIGHLIGHT_RANGE = 80;

export const createTable = (ctx: Context, pos: Vec2, hasWine = false) => {
    const game = ctx.game;
    const table = ctx.map.add([
        game.sprite("Table"),
        game.pos(pos),
        game.area(),
        game.z(4),
        "Wall",
        "Table",
    ]);

    if (hasWine) {
        const wineGlass = ctx.map.add([
            game.sprite("Wine_Entity"),
            game.pos(pos),
            game.z(5),
            "WineGlass",
        ]);

        wineGlass.onUpdate(() => {
            if (wineGlass.is("Poisoned")) {
                wineGlass.frame = 2;
                return;
            }

            const isPlayerNearby =
                !ctx.player.hidden &&
                wineGlass.pos.dist(ctx.player.pos) <= WINE_HIGHLIGHT_RANGE;
            wineGlass.frame = isPlayerNearby ? 1 : 0;
        });
    }

    return table;
}