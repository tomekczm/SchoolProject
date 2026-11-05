import { GameObj } from "kaplay";
import { Context } from "../main";

export function NpcDialogue(
    ctx: Context
) {
    const game = ctx.game
    return {
        id: "NpcDialogue",
        add() {
            const zis = this as unknown as GameObj
            zis.add([
                game.rect(16,16),
                game.outline(2, game.rgb(255,255,255))
            ])
        }
    }
}