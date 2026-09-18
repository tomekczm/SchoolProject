import { KAPLAYCtx, Vec2 } from "kaplay"
const SPEED = 100
const SHIFT_SPEED_MOVEMENT_MODIFIER = 1/2;
const PUSH_SPEED = 100;
export function addPlayer(game: KAPLAYCtx) {
    const player = game.add([
        game.rect(32, 32),
        game.area(),
        game.pos(0, 0),
        game.rotate(0),
        game.anchor("center"),
        "Player"
    ])

    game.onCollideUpdate("Player", "NPC", (_, collidedWith, collision) => {
        console.log("Colliding")
        if(collision?.isBottom()) {
            player.move(0, -PUSH_SPEED)
        }
        if(collision?.isTop()) {
            player.move(0, PUSH_SPEED)
        }
        if(collision?.isLeft()) {
            player.move(-PUSH_SPEED, 0)
        }
        if(collision?.isRight()) {
            player.move(PUSH_SPEED, 0)
        }
    })

    game.onUpdate(() => {
        player.rotateTo(player.pos.angle(game.mousePos()))
        let motion = new game.Vec2(0,0)
        if(game.isKeyDown("d")) motion = motion.add(1, 0);
        if(game.isKeyDown("a")) motion = motion.add(-1, 0);
        if(game.isKeyDown("s")) motion = motion.add(0, 1);
        if(game.isKeyDown("w")) motion = motion.add(0, -1);
        
        motion = motion.unit().scale(SPEED)

        if(game.isKeyDown('shift')) motion = motion.scale(SHIFT_SPEED_MOVEMENT_MODIFIER)
        player.move(motion)
        game.setCamPos(game.getCamPos().lerp(player.pos, 0.1))
    })
    return player
}