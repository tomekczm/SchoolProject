import { KAPLAYCtx } from "kaplay";
import { Globals } from "../main";

export function spawnDeadNpc(ctx: Globals, pos: any) {
    const game = ctx.game
    let sprite = ctx.map.add([
        game.anchor("center"),
        game.sprite("NPC_anim"),
        game.layer("bodies"),
        game.pos(pos),
        "NonUI",
        game.z(2)
    ])
    sprite.frame = 2;
}