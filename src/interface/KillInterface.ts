import { KAPLAYCtx } from "kaplay";

export function KillInterface(game: KAPLAYCtx) {
    const background = game.add([
        game.scale(3.0),
        game.sprite("KILL_BACKGROUND"), 
        game.fixed(),
        game.pos(game.width()-300,game.height()-150)
    ])
    const killText = background.add([
        game.scale(1),
        game.sprite("KILL_TEXT"), 
        game.fixed(),
        game.anchor("center")
    ])
    game.tween(
        killText.scale,
        new game.Vec2(1.5,1.5),
        5,
        (v) => killText.scaleTo(v),
        game.easings.easeInCirc
    )
}