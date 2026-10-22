import {  KAPLAYCtx } from "kaplay";

export function ScreenShake(game: KAPLAYCtx) {
    function getRange() {
        let scale = game.getCamScale().dist(0,0)
        return new game.Vec2(game.rand(-50/scale,50/scale), game.rand(-50/scale,50/scale))
    }
    game.setCamPos(game.getCamPos().add(getRange()))
    game.wait(0.05, () => {
            game.setCamPos(game.getCamPos().add(getRange()))
    })
    game.wait(0.1, () => {
            game.setCamPos(game.getCamPos().add(getRange()))
    })
    game.wait(0.15, () => {
        game.setCamPos(game.getCamPos().add(getRange()))
    })
}