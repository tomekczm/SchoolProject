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
import { createKeyhintsHandler } from "./KeyHints";
import { NpcDialogue, Response } from "../entities/NpcDialogue";

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
    context.keyHints = createKeyhintsHandler(context)
    //context.keyHints.enableHint("Kill_Knife")
    //context.keyHints.enableHint("Talk_Npc")
    const npc1 = createNPC(context);
    npc1.setPoints([
            new game.Vec2(80, 200),
            new game.Vec2(300, 200),
            new game.Vec2(300, 80),
            new game.Vec2(80, 80),
    ])
    npc1.setOutfitToRandom()

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

    const npc4 = createNPC(context);
    npc4.setPoints([
        new game.Vec2(237, 149),
        new game.Vec2(871, 149),
    ])
    npc4.setOutfitToRandom()
    npc4.setTarget(false)
    npc4.setType("Drinker")
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


    createLocker(context, new game.Vec2(50, 300));
    createTable(context, new game.Vec2(600, 300), true);


    const dialogues = ['I love this party!!!!!💀💀', 'Aint no party like this!!!', "Hi", "Do i know you?", "Ok"]
    function createSimpleDialogue(idx: number) {
        const simpleDialogue = NpcDialogue(context); // properly componentized
        simpleDialogue.onDialogueStarted(() => {
            simpleDialogue.getLogger().Log(dialogues[idx])
            simpleDialogue.questionPlayer(
                Response("*End conversation*")
            )
        })
        return simpleDialogue;
    }

    npc1.setNpcDialogue(createSimpleDialogue(0))
    npc2.setNpcDialogue(createSimpleDialogue(1))
    npc3.setNpcDialogue(createSimpleDialogue(2))
    npc4.setNpcDialogue(createSimpleDialogue(3))
    npc5.setNpcDialogue(createSimpleDialogue(4))

    npc1.create()
    npc2.create()
    npc3.create()
    npc4.create()
    npc5.create()

    return map


}