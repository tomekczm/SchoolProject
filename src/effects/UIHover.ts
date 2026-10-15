import { AreaComp, GameObj, KAPLAYCtx, ScaleComp, TimerComp, TweenController } from "kaplay";

export function UIHoverEffect(game: KAPLAYCtx, object: GameObj<AreaComp | TimerComp | ScaleComp>, scaleFactor = 1.1, speed = 0.1) {
    let scaleDown: TweenController | undefined;
    let scaleUp: TweenController | undefined;
    let normal = object.scale;
    let upscaled = new game.Vec2(normal.x * scaleFactor);
    object.onHover(() => {
        scaleDown?.cancel()
        scaleUp?.cancel()
        const dist = object.scale.sub(upscaled).dist()
        scaleUp = object.tween(
            object.scale,
            upscaled,
            dist * speed,
            (v) => object.scaleTo(v)
        )
    })
    object.onHoverEnd(() => {
        scaleDown?.cancel()
        scaleUp?.cancel()
        const dist = object.scale.sub(normal).dist()
        scaleDown = object.tween(
            object.scale,
            new game.Vec2(normal.x),
            dist * speed,
            (v) => object.scaleTo(v)
        )
    })
}