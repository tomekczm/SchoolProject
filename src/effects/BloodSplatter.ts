import { KAPLAYCtx, Vec2 } from "kaplay";

export function createBloodSplatter(game: KAPLAYCtx, pos: any) {
    const sprite = game.getSprite("Blood")!.data!;
  
    const blood = game.add([
        game.pos(pos),
        game.layer("vfx_under"),
        game.particles(
                {
                    max: 1000,
                    speed: [125,150],
                    lifeTime: [2,4],
                    angularVelocity: [0, 100],
                    damping: [2, 10],
                    opacities: [1, 0],
                    texture: sprite.tex,
                    quads: sprite.frames,
                },
                {
                    direction: 0,
                    spread: 360,
                },
            )
    ])
    game.wait(5, () => {
        blood.destroy()
    })
    blood.emit(100)
}