// // Odpowiedzialna za map.ts = Dominik Michocki
import { KAPLAYCtx } from "kaplay";

export function testMap(game: KAPLAYCtx) {
    //game.add([game.pos(0, 0), game.rect(game.width(), game.height()), game.color(255, 255, 255), game.layer("backgroud"), game.fixed(), "Background"]);
    game.setBackground(
        game.color(255, 255, 255).color
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
            "=": () => [
                game.sprite("Panda"),
                game.area(),
                //game.body({ isStatic: true }),
                game.tile({ isObstacle: true }),
                "Wall"
            ]
        }
    })
    return map
}