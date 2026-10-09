import { KAPLAYCtx, Vec2 } from "kaplay";

export async function createBloodPool(game: KAPLAYCtx, pos: any) {
    let scale = 30;
    let count = game.randi(4) + 1;

    for(let i = 0; i < count; i++) {
        let offX = game.rand(10, 25);
        let offY = game.rand(10, 25);
        let div = i+1
        let offset = i === 0 ? game.vec2(0) : game.vec2(offX, offY)
        const blood = game.add([
            game.circle(0),
            game.pos(pos.add(offset)),
            game.color(255,0,0),
            game.anchor("center"),
            game.layer("background")
        ])
        game.tween(
            0, scale, 5 + div,
            (v) => blood.radius = v,
            game.easings.easeOutCubic
        )
        await game.wait(
            game.rand(4/div, 8/div)
        )
    }
}