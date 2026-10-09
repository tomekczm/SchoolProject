import { KAPLAYCtx } from "kaplay";

export function spawnDeadNpc(game: KAPLAYCtx, pos: any) {
    let sprite = game.add([
        game.anchor("center"),
        game.sprite("NPC_anim"),
        game.layer("bodies"),
        game.pos(pos)
    ])
    sprite.frame = 2;
}