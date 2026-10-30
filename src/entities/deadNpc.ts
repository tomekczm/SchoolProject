import { KAPLAYCtx } from "kaplay";
import { Context } from "../main";
import { dressUpNpc, NpcOutfit } from "./npc";

export function spawnDeadNpc(ctx: Context, pos: any, outfit: NpcOutfit) {
    const game = ctx.game
    let sprite = ctx.map.add([
        game.anchor("center"),
        game.sprite("NPC_anim"),
        game.layer("bodies"),
        game.pos(pos),
        "NonUI",
        game.z(2)
    ])
    dressUpNpc(ctx, sprite, outfit)
    sprite.frame = 2;
}