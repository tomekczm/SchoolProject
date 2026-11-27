import { Vec2 } from "kaplay";
import { Context } from "../main";
import { wine } from "../items/Vine";
import { poison } from "../items/Poison";

const WINE_HIGHLIGHT_RANGE = 80;

export const createTable = (ctx: Context, pos: Vec2, hasWine = false) => {
    const game = ctx.game;
    const table = ctx.map.add([
        game.tile(),
        game.sprite("Table"),
        game.pos(pos),
        game.area(),
        game.z(4),
        "Wall",
        "Table",
    ]);

    let wineGlass: ReturnType<typeof addWineGlass> | undefined;

    function addWineGlass() {
        const glass = ctx.map.add([
            game.tile(),
            game.sprite("Wine_Entity"),
            game.pos(pos),
            game.area(),
            game.z(5),
            "WineGlass",
        ]);
        glass.frame = 0;
        glass.onHoverUpdate(() => {
            const isPoisoned = glass.is("Poisoned");
            const isInRange =
                !ctx.player.hidden &&
                ctx.player.pos.dist(glass.pos) <= WINE_HIGHLIGHT_RANGE;

            if (
                isInRange &&
                !isPoisoned &&
                ctx.inventory.isEquipped(poison)
            ) {
                ctx.keyHints.enableHint("Use");
                ctx.keyHints.enableHint("Grab");
            } else if (isInRange && !isPoisoned) {
                ctx.keyHints.enableHint("Grab");
            } else {
                ctx.keyHints.disableHint("Grab");
                ctx.keyHints.disableHint("Use");
            }

            const frame = isPoisoned ? 2 : isInRange ? 1 : 0;
            glass.use(game.sprite("Wine_Entity", { frame }));
        });
        glass.onHoverEnd(() => {
            ctx.keyHints.disableHint("Grab");
            ctx.keyHints.disableHint("Use");
            glass.use(
                game.sprite("Wine_Entity", {
                    frame: glass.is("Poisoned") ? 2 : 0,
                }),
            );
        });
        glass.onClick(() => {
            if (
                ctx.player.hidden ||
                ctx.player.pos.dist(glass.pos) > WINE_HIGHLIGHT_RANGE ||
                glass.is("Poisoned")
            ) {
                return;
            }

            ctx.inventory.addItem(wine);
            glass.destroy();
            ctx.keyHints.disableHint("Grab");
            ctx.keyHints.disableHint("Use");
            if (wineGlass === glass) wineGlass = undefined;
        });

        return glass;
    }

    if (hasWine) wineGlass = addWineGlass();

    game.onKeyPress("e", () => {
        if (
            ctx.player.hidden ||
            wineGlass ||
            !ctx.inventory.isEquipped(wine) ||
            table.pos.dist(ctx.player.pos) > WINE_HIGHLIGHT_RANGE
        ) {
            return;
        }

        wine.onUnequip(ctx);
        ctx.inventory.consume();
        wineGlass = addWineGlass();
    });
    table.onUpdate(() => {
         const isInRange =
            !ctx.player.hidden &&
            ctx.player.pos.dist(table.pos) <= WINE_HIGHLIGHT_RANGE;
        if(isInRange && !wineGlass && ctx.inventory.isEquipped(wine)) {
            ctx.keyHints.enableHint("Place");
        } else {
            ctx.keyHints.disableHint("Place");
        }
    });

    return table;
}
