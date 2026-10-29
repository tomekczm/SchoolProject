import kaplay, { AnchorComp, AreaComp, GameObj, KAPLAYCtx, LevelComp, PosComp, RotateComp, SpriteComp, ZComp } from "kaplay";
import { addPlayer } from "./entities/player";
import { testMap } from "./interface/map";
import { Inventory } from "./interface/Inventory";
import { loadSprites } from "./loadSprites";
import { createNPC } from "./entities/npc";
export const game = kaplay();

await loadSprites(game)

export type Context = {
    game: KAPLAYCtx
    map: GameObj<PosComp | LevelComp>,
    player: ReturnType<typeof addPlayer>
}

const context: Context = {} as Context
context.game = game;
context.map = testMap(context);
context.player = addPlayer(context)
/*
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
)*/

const npc1 = createNPC(context);
npc1.setPoints([
        new game.Vec2(80, 200),
        new game.Vec2(400, 200),
        new game.Vec2(400, 80),
        new game.Vec2(80, 80),
])
npc1.create()
const npc2 = createNPC(context);
npc2.setPoints([
    new game.Vec2(500, 200),
    new game.Vec2(800, 200),
    new game.Vec2(800, 80),
    new game.Vec2(500, 80),
])
npc2.setTarget(true)
npc2.setType("Walker")
npc2.create()

    /*makeNPC(game,globals, [
        new game.Vec2(80, 400),
        new game.Vec2(400, 400),
        new game.Vec2(400, 600),
        new game.Vec2(80, 600)
    ],
    [
        new game.Vec2(80, 80)
    ]*/

Inventory(context)
