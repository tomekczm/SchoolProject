// // Odpowiedzialna za map.ts = Dominik Michocki
import { KAPLAYCtx } from "kaplay";
import { Context } from "../main";
import { createNPC } from "../entities/npc";
import { addPlayer } from "../entities/player";
import { knife } from "../items/Knife";
import { wine } from "../items/Vine";
import { createLocker } from "../entities/locker";
import { createTable } from "../entities/table";
import { poison } from "../items/Poison";

export function testMap(context: Context) {
    const {game} = context;
    //game.add([game.pos(0, 0), game.rect(game.width(), game.height()), game.color(255, 255, 255), game.layer("backgroud"), game.fixed(), "Background"]);
    game.setBackground(
        game.color(0,0,0).color
    )

    const map = game.addLevel([
        "=====================================",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "===         =========================",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=                                   =",
        "=====================================",

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
                game.body({ isStatic: true }),
                game.tile({ isObstacle: true }),
                game.z(4),
                "Wall"
            ]
        }
    })
    context.map = map
    context.player = addPlayer(context)
    const npc1 = createNPC(context);
    npc1.setPoints([
            new game.Vec2(80, 200),
            new game.Vec2(300, 200),
            new game.Vec2(300, 80),
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

    knife.create(context, new game.Vec2(200, 200));
    //wine.create(context, new game.Vec2(300, 200));
    poison.create(context, new game.Vec2(700, 300));
    const npc3 = createNPC(context);
    npc3.setPoints([
        new game.Vec2(200, 280),
        new game.Vec2(79, 375)
    ])
    npc3.setOutfitToRandom()
    npc3.setTarget(false)
    npc3.setType("Stander")
    npc3.setReaction("Runner")
    npc3.create()

    const npc4 = createNPC(context);
    npc4.setPoints([
        new game.Vec2(237, 149),
        new game.Vec2(871, 149),
    ])
    npc4.setOutfitToRandom()
    npc4.setTarget(false)
    npc4.setType("Walker")
    npc4.setReaction("Runner")
    npc4.create()

    const npc5 = createNPC(context);
    npc5.setPoints([
        new game.Vec2(99, 283),
        new game.Vec2(299, 283),
    ])
    npc5.setOutfitToRandom()
    npc5.setTarget(false)
    npc5.setType("Stander")
    npc5.setReaction("Runner")
    npc5.create()

    createLocker(context, new game.Vec2(350, 300));
    createTable(context, new game.Vec2(600, 300), true);
    return map


}