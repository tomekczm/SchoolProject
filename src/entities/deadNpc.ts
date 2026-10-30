import { KAPLAYCtx } from "kaplay";
import { Context } from "../main";
import { dressUpNpc, NpcOutfit } from "./npc";

export function spawnDeadNpc(ctx: Context, pos: any, outfit: NpcOutfit) {
    const game = ctx.game
    let DeadBody = ctx.map.add([
        game.anchor("center"),
        game.sprite("NPC_anim"),
        game.layer("bodies"),
        game.pos(pos),
        game.area(),
        "NonUI",
        "DeadBody",
        game.z(2)

    ])
    dressUpNpc(ctx, DeadBody, outfit)
    DeadBody.frame = 2;
}