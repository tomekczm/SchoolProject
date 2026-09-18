import { KAPLAYCtx } from "kaplay";

export function KillInterface(game: KAPLAYCtx) {
    game.add([
        game.scale(3.0),
        game.sprite("KILL_BACKGROUND"), 
        game.fixed(),
        game.pos(game.width()-300,game.height()-150)
    ])
    game.add([
        game.scale(3.0),
        game.sprite("KILL_TEXT"), 
        game.fixed(),
        game.pos(game.width()-300,game.height()-150)
    ])
}