// Tomasz
import {  GameObj, KAPLAYCtx, PosComp } from "kaplay";
import { Context, game } from "../main";

export async function UIShake(
    ctx: Context,
    obj: GameObj<PosComp>,
    speed = 0.025,
    range = 10,
    stack = 20,
) {
    const game = ctx.game;
    let before = obj.pos;
    for(let i = 0; i < stack; i++) {
        await game.wait(speed)
        const newVec = game.vec2(
            game.rand(-range, range),
            game.rand(-range, range),
        )
        obj.pos = before.add(newVec)
    }
    await game.wait(speed)
    obj.pos = before;
}