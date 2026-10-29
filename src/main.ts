import kaplay, { AnchorComp, AreaComp, GameObj, KAPLAYCtx, LevelComp, PosComp, RotateComp, SpriteComp, ZComp } from "kaplay";
import { addPlayer } from "./entities/player";
import { testMap } from "./interface/map";
import { Inventory } from "./interface/Inventory";
import { loadSprites } from "./loadSprites";
export const game = kaplay();

await loadSprites(game)

export type Context = {
    game: KAPLAYCtx
    map: GameObj<PosComp | LevelComp>,
    player: ReturnType<typeof addPlayer>
}

const context: Context = {} as Context
context.game = game;

game.scene("menu", () => {
    game.setBackground(
        game.color(0,0,0).color
    );
    game.add([
        game.text("Press Space to start"),
        game.pos(game.width() / 2, game.height() / 2),
        game.area(),
        game.anchor("center"),
        game.color(255, 255, 255),
    ]);

    game.onKeyPress("space", () => {
        game.go("testMapScene");
    });
});
game.scene("testMapScene", () => {
    context.map = testMap(context);
    context.player = addPlayer(context);

    Inventory(context);
});

game.go("testMapScene"); // Change to menu for menu scene when implemented