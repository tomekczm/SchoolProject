import { AnchorComp, GameObj, OutlineComp, RectComp, RotateComp } from "kaplay";
import { Context } from "../main";

export function NpcDialogue(
    ctx: Context
) {
    const game = ctx.game
    let background: GameObj<RectComp | AnchorComp | OutlineComp | RotateComp>;
    return {
        id: "NpcDialogue",
        add() {
            const zis = this as unknown as GameObj
            background = zis.add([
                game.rect(32,32),
                game.pos(0,-25),
                game.anchor(
                    game.vec2(0,1)
                ),
                game.outline(2, game.rgb(0,0,0)),
                game.rotate(0),
                game.opacity(0)
            ])
        },
        update() {
            
        },
        say(s: string) {
            const zis = this as unknown as GameObj
            zis.add([
                game.styledText(s, {
                    fill: game.rgb(0,0,0),
                    size: 16,
                }),
                game.anchor("center"),
                game.pos(0,-20)
            ])
        }
    }
}