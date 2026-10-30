import { Context } from "../main";

export function addLogger(ctx: Context) {
    const map = ctx.map;
    const game = ctx.game
    const spawnPoint = map.add([
        game.pos(game.center()),
        game.fixed(),
        game.z(100)
    ])
    function Log(text: string) {
        spawnPoint.add([
            game.text(text, {
                
            }),
            game.anchor("center"),
            game.color(1,1,1),
        ])
        game.debug.log("aa")
    }

    return { Log }
}