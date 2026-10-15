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
    const rect = map.add([
        game.rect(32,32),
        game.color(255,255,1),
        game.pos(64,64),
        game.tile(),
        game.agent({ speed: 100, allowDiagonals: true }),
    ])
    rect.setTarget(new game.Vec2(500,250))
}