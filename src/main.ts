import kaplay, { AnchorComp, AreaComp, GameObj, KAPLAYCtx, LevelComp, PosComp, RotateComp, SpriteComp, ZComp } from "kaplay";
import { addPlayer } from "./entities/player";
import { makeNPC } from "./entities/npc";
import { testMap } from "./interface/map";
import { Inventory } from "./interface/Inventory";
import { loadSprites } from "./loadSprites";
import { setupRenderPipeline } from "./pipeline/RenderPipeline";
export const game = kaplay();

await loadSprites(game)

export type Context = {
    pipeline: ReturnType<typeof setupRenderPipeline>;
    inventory: {};
    game: KAPLAYCtx
    map: GameObj<PosComp | LevelComp>,
    player: GameObj<string | PosComp | ZComp | AreaComp | RotateComp | AnchorComp | SpriteComp>
}

const context: Context = {} as Context
context.game = game;
context.map = testMap(context);
context.player = addPlayer(context)
context.inventory = await Inventory(context);
context.pipeline = setupRenderPipeline(context)

context.pipeline.EnableLight()

makeNPC(context, [
        new game.Vec2(80, 200),
        new game.Vec2(400, 200),
        new game.Vec2(400, 80),
        new game.Vec2(80, 80),
    ], [
        new game.Vec2(500,250),
    ],
    )
makeNPC(context, [
    new game.Vec2(500, 200),
    new game.Vec2(800, 200),
    new game.Vec2(800, 80),
    new game.Vec2(500, 80),
], [
    new game.Vec2(650,250),
],
true
)

    /*makeNPC(game,globals, [
        new game.Vec2(80, 400),
        new game.Vec2(400, 400),
        new game.Vec2(400, 600),
        new game.Vec2(80, 600)
    ],
    [
        new game.Vec2(80, 80)
    ]*/