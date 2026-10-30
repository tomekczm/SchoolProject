import { GameObj } from "kaplay";
import { Context, game } from "../main";
import { dressUpNpc, NpcOutfit } from "./npc";
import { UIShake } from "../effects/UIShake";

const cleanups = new Map<GameObj, () => void>()
export function onTargetKilled(npc: GameObj) {
    cleanups.get(npc)?.();
}

// odliczanie czasu
export function setTargetForGame(ctx: Context, npc: GameObj, outfit: NpcOutfit) {
    const background = ctx.game.add([
        ctx.game.rect(300,400),
        ctx.game.color(0,0,0),
        ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.pos(150, ctx.game.height() - 100),
    ])
    const Npc = background.add([
        ctx.game.sprite("NPC_anim"),
        ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.scale(5)
    ])
    Npc.frame = 1

    dressUpNpc(ctx, Npc, outfit)
    const targetFrame = Npc.add([
        ctx.game.sprite("TARGET"),
        ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.pos(0, -10),
    ])
    cleanups.set(npc, async () => {
        targetFrame.add([
            ctx.game.sprite("TARGET_DEAD"),
            ctx.game.anchor("center"),
            ctx.game.fixed(),
        ])

        await UIShake(ctx, background) // wait till finished;

        ctx.game.tween(
            background.pos,
            background.pos.sub(400,0),
            0.5,
            (vec) => background.pos = vec,
            game.easings.easeInBack
        )

        //background.destroy()
        //Npc.destroy()
        //targetFrame.destroy()
    })
}