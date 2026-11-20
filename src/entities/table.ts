import { Vec2 } from "kaplay";
import { Context } from "../main";
import { wine } from "../items/Vine";
import { InterfaceButton } from "../interface/InterfaceButton";

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
            game.z(5),
            "WineGlass",
        ]);
        let pickupButton: Awaited<ReturnType<typeof InterfaceButton>> | undefined;
        let isCreatingButton = false;

        glass.onUpdate(() => {
            const isPoisoned = glass.is("Poisoned");
            const isPlayerNearby =
                !ctx.player.hidden &&
                glass.pos.dist(ctx.player.pos) <= WINE_HIGHLIGHT_RANGE;
            glass.frame = isPoisoned ? 2 : isPlayerNearby ? 1 : 0;

            if (!isPlayerNearby || isPoisoned) {
                pickupButton?.clear();
                pickupButton = undefined;
                return;
            }

            if (pickupButton || isCreatingButton) return;
            isCreatingButton = true;

            void InterfaceButton(ctx, 200).then((button) => {
                if (
                    ctx.player.hidden ||
                    glass.pos.dist(ctx.player.pos) > WINE_HIGHLIGHT_RANGE
                ) {
                    button.clear();
                    return;
                }

                pickupButton = button;
                button.enable();
                button.text.frame = 2;
                button.background.onClick(() => {
                    if (
                        ctx.player.hidden ||
                        glass.pos.dist(ctx.player.pos) > WINE_HIGHLIGHT_RANGE ||
                        ctx.inventory.isEquipped(wine)
                    ) {
                        return;
                    }
                    pickupButton?.clear();
                    pickupButton = undefined;
                    ctx.inventory.setSlot(1, wine);
                    glass.destroy();
                    if (wineGlass === glass) wineGlass = undefined;
                });
            }).finally(() => {
                isCreatingButton = false;
            });
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

    return table;
}
