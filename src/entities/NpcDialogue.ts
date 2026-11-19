import { AnchorComp, GameObj, OutlineComp, PosComp, RectComp, RotateComp } from "kaplay";
import { Context } from "../main";
import { addLogger } from "../interface/Log";

type NpcDialogue = ReturnType<typeof NpcDialogue>
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
                game.pos(7, -25),
                game.anchor("center"),
                game.z(100)
            ])
            logger = addLogger(ctx, 16, 4, mountPoint);
            background = zis.add([
                game.rect(8,8),
                game.pos(0,0),
                game.anchor("center"),
                game.outline(1, game.rgb(0,0,0)),
                game.rotate(0),
                game.z(100)
            ])
            zis.add([
                game.pos(3,5),
                game.styledText("F", {
                    size: 64,
                    fill: game.rgb(255,255,255),
                    outline: {
                        width: 10,
                        color: game.rgb(0,0,0)
                    }                    
                }),
                game.scale(0.25),
                game.anchor("center"),
                game.z(101)
            ])
        },
        update() {
            background.angle += 1
        },
        getLogger() {
            return logger;
        }
    }
}