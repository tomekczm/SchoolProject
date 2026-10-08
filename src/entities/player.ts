// Odpowiedzialna za player.ts = Tomasz Czarnecki
import { KAPLAYCtx, Vec2 } from "kaplay"
const SPEED = 200
const SHIFT_SPEED_MOVEMENT_MODIFIER = 1/2;
const PUSH_SPEED = 100;
const KNIFE_DISTANCE = 100;
export function addPlayer(game: KAPLAYCtx) {
    const player = game.add([
        game.area(),
        game.pos(100, 100),
        game.rotate(0),
        game.anchor("center"),
        game.sprite("Panda"),
        "Player"
    ])

    game.onCollideUpdate("Player", "NPC", (_, collidedWith, collision) => {
        if(collision?.isBottom()) {
            player.move(0, -PUSH_SPEED)
        }
        if(collision?.isTop()) {
            player.move(0, PUSH_SPEED)
        }
        if(collision?.isLeft()) {
            player.move(PUSH_SPEED, 0)
        }
        if(collision?.isRight()) {
            player.move(-PUSH_SPEED, 0)
        }
    })

    game.onCollideUpdate("Player", "Wall", (_, collidedWith, collision) => {
        if(collision?.isBottom()) {
            player.move(0, -PUSH_SPEED)
        }
        if(collision?.isTop()) {
            player.move(0, PUSH_SPEED)
        }
        if(collision?.isLeft()) {
            player.move(PUSH_SPEED, 0)
        }
        if(collision?.isRight()) {
            player.move(-PUSH_SPEED, 0)
        }
    })

    game.onUpdate(() => {

        for(const npc of game.get("NPC")) {
            const pos: Vec2 = npc.pos;
            if(pos.dist(player.pos) <= KNIFE_DISTANCE) {
                if(!player.is("IN_RANGE")) player.tag("IN_RANGE")
                if(!npc.is("Focused")) npc.tag("Focused")
                break;
            } else {
                if(npc.is("Focused")) npc.untag("Focused")
                player.untag("IN_RANGE")
            }
        }
        //player.rotateTo(player.pos.angle(game.toWorld(game.mousePos())))
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