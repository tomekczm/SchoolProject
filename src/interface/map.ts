// // Odpowiedzialna za map.ts = Dominik Michocki
import { KAPLAYCtx } from "kaplay";
import { Context } from "../main";

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
    return map
}