// // Odpowiedzialna za map.ts = Dominik Michocki
import { KAPLAYCtx } from "kaplay";
import { Context } from "../main";
import { createNPC } from "../entities/npc";

export function testMap(context: Context) {
    const {game} = context;
    //game.add([game.pos(0, 0), game.rect(game.width(), game.height()), game.color(255, 255, 255), game.layer("backgroud"), game.fixed(), "Background"]);
    game.setBackground(
        game.color(0,0,0).color
    )

    const map = game.addLevel([
        "===========================",
        "=                         =",
        "=                         =",
        "=                         =",
        "=                         =",
        "=           =             =",
        "=           =             =",
        "=           =             =",
        "=           =             =",
        "===========================",

    ], {
        tileHeight: 32,
        tileWidth: 32,
        tiles: {
            " ": () => [
                game.z(-100),
                game.sprite("Wooden_Planks"),
            ],
            "=": () => [
                game.sprite("Wall"),
                game.area(),
                //game.body({ isStatic: true }),
                game.tile({ isObstacle: true }),
                game.z(4),
                "Wall"
            ]
        }
    })
    context.map = map
    const npc1 = createNPC(context);
    npc1.setPoints([
            new game.Vec2(80, 200),
            new game.Vec2(400, 200),
            new game.Vec2(400, 80),
            new game.Vec2(80, 80),
    ])
    npc1.setOutfitToRandom()
    npc1.create()
    const npc2 = createNPC(context);
    npc2.setPoints([
        new game.Vec2(500, 200),
        new game.Vec2(800, 200),
        new game.Vec2(800, 80),
        new game.Vec2(500, 80),
    ])
    npc2.setOutfitToRandom()
    npc2.setTarget(true)
    npc2.setType("Walker")
    npc2.create()
    return map
}