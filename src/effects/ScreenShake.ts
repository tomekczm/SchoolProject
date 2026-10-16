import {  KAPLAYCtx } from "kaplay";

export function ScreenShake(game: KAPLAYCtx) {
    game.setCamPos(game.getCamPos().add(new game.Vec2(game.rand(-50,50), game.rand(-50,50))))
    game.wait(0.05, () => {
        game.setCamPos(game.getCamPos().add(new game.Vec2(game.rand(-50,50), game.rand(-50,50))))
    })
    game.wait(0.1, () => {
        game.setCamPos(game.getCamPos().add(new game.Vec2(game.rand(-50,50), game.rand(-50,50))))
    })
    game.wait(0.15, () => {
        game.setCamPos(game.getCamPos().add(new game.Vec2(game.rand(-50,50), game.rand(-50,50))))
    })
}