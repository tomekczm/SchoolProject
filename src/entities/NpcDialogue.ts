import { AnchorComp, AreaComp, Comp, GameObj, KEventController, OpacityComp, OutlineComp, PosComp, RectComp, RotateComp } from "kaplay";
import { Context } from "../main";
import { addLogger, Logger } from "../interface/Log";
import { UIHoverEffect } from "../effects/UIHover";
import { createNPC } from "./npc";

type NpcResponse = ReturnType<typeof Response>;
type Callback = () => void;
export function Response(line: string) {
    return { 
        line,
        _actionOnChoosen: undefined as undefined | Callback,
        onChoosen(action: Callback) {
            this._actionOnChoosen = action;
            return this;
        }
    }
}

export interface NpcDialogueComp extends Comp {
    onDialogueStarted(callback: Callback): void,
    questionPlayer(...choices: NpcResponse[]): void,
    getLogger(): Logger
}

export function NpcDialogue(
    ctx: Context
): NpcDialogueComp {
    const game = ctx.game
    let logger: Logger;
    let onKeyDown: KEventController;
    let onDialogueStart: Callback | undefined
    return {
        id: "NpcDialogue",
        require: ["area"],
        onDialogueStarted(callback: Callback) {
            onDialogueStart = callback;
        },
        questionPlayer(...choices: NpcResponse[]) {
            let objs = []
            for(let idx = 0; idx < choices.length; idx++) {
                const choice = choices[idx]
                let obj = game.add([
                    game.styledText(choice.line, {
                        size: 64,
                        outline: {
                            width: 12,
                            color: game.rgb(0,0,0),
                        }
                    }),
                    game.fixed(),
                    game.pos(),
                    game.anchor("center"),
                    game.z(100000),
                    game.area(),
                    game.scale(1),
                    game.timer(),
                    game.color(125,125,125)
                ])
                objs.push(obj)
                //UIHoverEffect(game, obj, 1.1, 0.25)
                obj.onHover(() => {
                    game.tween(obj.color, game.rgb(255,255,255), 0.25, (v) => obj.color = v)
                })
                obj.onHoverEnd(() => {
                    game.tween(obj.color, game.rgb(125,125,125), 0.25, (v) => obj.color = v)
                })
                obj.pos = game.vec2(game.width()-obj.width/2, game.height()-(70*(idx+1)))
                obj.onClick(() => {
                    choice._actionOnChoosen?.()
                    objs.forEach((o) => o.destroy())
                })
            }
        },
        add(this: GameObj<NpcDialogueComp | AreaComp>) {
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
            })

            zis.onHoverEnd(() => {
                ctx.keyHints.disableHint("Talk_Npc")
            })

            zis.onDestroy(() => {
                e1.cancel()
                ctx.keyHints.disableHint("Talk_Npc")
            })

            onKeyDown = game.onKeyPress("f", () => {
                if(zis.isHovering())
                    onDialogueStart?.()
            })
            

        },
        destroy() {
            onKeyDown.cancel()
        },
        update() {
            //background.angle += 1;
        },
        getLogger() {
            return logger;
        }
    }
}
