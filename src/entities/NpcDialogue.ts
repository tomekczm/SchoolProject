import { AnchorComp, GameObj, OutlineComp, PosComp, RectComp, RotateComp } from "kaplay";
import { Context } from "../main";
import { addLogger } from "../interface/Log";

export function NpcDialogue(
    ctx: Context
) {
    const game = ctx.game
    let background: GameObj<RectComp | AnchorComp | OutlineComp | RotateComp>;
    let logger: ReturnType<typeof addLogger>;
    return {
        id: "NpcDialogue",
        add() {
            const zis = this as unknown as GameObj<PosComp>
            const mountPoint = zis.add([
                game.pos(3, -25),
                game.anchor("center"),
                game.z(100)
            ])
            logger = addLogger(ctx, 0.35, mountPoint);
            /*
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
                */
        },
        update() {

        },
        getLogger() {
            return logger;
        }
    }
}
