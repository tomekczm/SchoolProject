import { AnchorComp, AreaComp, GameObj, OpacityComp, OutlineComp, PosComp, RectComp, RotateComp } from "kaplay";
import { Context } from "../main";
import { addLogger } from "../interface/Log";

export function NpcDialogue(
    ctx: Context
) {
    const game = ctx.game
    let logger: ReturnType<typeof addLogger>;
    return {
        id: "NpcDialogue",
        add() {
            const zis = this as unknown as GameObj<PosComp | AreaComp>
            const mountPoint = zis.add([
                game.pos(3, -25),
                game.anchor("center"),
                game.z(100)
            ])
            logger = addLogger(ctx, 0.35, mountPoint);
            

            zis.onHover(() => {
                ctx.keyHints.enableHint("Talk_Npc")
            })

            zis.onHoverEnd(() => {
                ctx.keyHints.disableHint("Talk_Npc")
            })

            zis.onDestroy(() => {
                ctx.keyHints.disableHint("Talk_Npc")
            })

        },
        update() {
            //background.angle += 1;
        },
        getLogger() {
            return logger;
        }
    }
}
