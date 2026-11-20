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
        questionPlayer(choices: string[]) {
            for (const choice of choices) {
                game.add([
                    game.styledText(choice, {
                        size: 64
                    }),
                    game.fixed(),
                    game.pos(game.width(), game.height()-100),
                    game.anchor("topleft")
                ])

            }
        },
        add() {
            const zis = this as unknown as GameObj<PosComp | AreaComp>
            const mountPoint = zis.add([
                game.pos(3, -25),
                game.anchor("center"),
                game.z(100)
            ])
            logger = addLogger(ctx, 0.35, mountPoint);

            const e1 = game.onKeyPress("t", () => {
                if (!zis.isHovering()) return;
                zis.trigger("Interacted")
            })

            zis.onHover(() => {
                ctx.keyHints.enableHint("Talk_Npc")
                this.questionPlayer(['hi'])
            })

            zis.onHoverEnd(() => {
                ctx.keyHints.disableHint("Talk_Npc")
            })

            zis.onDestroy(() => {
                e1.cancel()
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
