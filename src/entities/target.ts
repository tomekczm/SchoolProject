import { Globals } from "../main";

// odliczanie czasu
export function setTarget(ctx: Globals, decorations: (string | null)[]) {
    const Npc = ctx.game.add([
        ctx.game.sprite("NPC_anim"),
        ctx.game.anchor("center"),
        ctx.game.fixed(),
        ctx.game.pos(ctx.game.width() - 100, ctx.game.height() - 100),
        ctx.game.scale(5)
    ])
            Npc.frame = 1

    for(const clothe of decorations) {
        if(clothe === null) continue;
        const inst = Npc.add([
            ctx.game.sprite(clothe),
            ctx.game.anchor("center")
        ])
        inst.frame = 1
    }
}