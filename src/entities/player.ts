import { KAPLAYCtx, Vec2 } from "kaplay"
const SPEED = 100
const SHIFT_SPEED_MOVEMENT_MODIFIER = 1/2;
export function addPlayer(game: KAPLAYCtx) {
    const player = game.add([
        game.rect(32, 32),
        game.pos(10, 20),
        "Player"
    ])

    game.onUpdate(() => {
        let motion = new game.Vec2(0,0)
        if(game.isKeyDown("d")) motion = motion.add(SPEED, 0);
        if(game.isKeyDown("a")) motion = motion.add(-SPEED, 0);
        if(game.isKeyDown("s")) motion = motion.add(0, SPEED);
        if(game.isKeyDown("w")) motion = motion.add(0, -SPEED);
        
        if(game.isKeyDown('shift')) motion = motion.scale(SHIFT_SPEED_MOVEMENT_MODIFIER)
        player.move(motion)
    console.log('test')
    })
}