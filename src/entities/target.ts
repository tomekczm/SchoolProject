import { Context } from "../main";

export function onTargetKilled() {}

// odliczanie czasu
export function setTargetForGame(ctx: Context, clothes: (string | null)[]) {
    const background = ctx.game.add([
        ctx.game.rect(300,400),
        ctx.game.color(0,0,0),
        ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.pos(150, ctx.game.height() - 100),
    ])
    const Npc = ctx.game.add([
        ctx.game.sprite("NPC_anim"),
        ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.pos(150, ctx.game.height() - 100),
        ctx.game.scale(5)
    ])
            Npc.frame = 1

    for(const clothe of clothes) {
        if(clothe === null) continue;
        const inst = Npc.add([
            ctx.game.sprite(clothe),
            ctx.game.anchor("center")
        ])
        inst.frame = 1
    }
        ctx.game.add([
        ctx.game.sprite("TARGET"),
                ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.pos( 150, ctx.game.height() - 150),
        ctx.game.scale(5)
    ])
}