import { GameObj, TextComp, AnchorComp, ColorComp, PosComp } from "kaplay";
import { Context } from "../main";
import { StyledTextComp } from "kaplay-plugin-text";

type Message = GameObj<PosComp | AnchorComp | StyledTextComp>;

export function addLogger(ctx: Context) {
    const map = ctx.map;
    const game = ctx.game;
    const messages = new Set<Message>();
    const spawnPoint = map.add([
        game.pos(game.center().add(game.vec2(0, -300))),
        game.fixed(),
        game.z(100)
    ])

    const outlineWidth = 4;
    const textSize = 32;

    function updateList() {
        let y = 0;
        const list = Array.from(messages).reverse()
        for(const message of list) {
            message.pos = game.vec2(0,y)
            y -= outlineWidth + textSize;
        }
    }
    function Log(
        text: string, 
        fill=game.rgb(255, 255, 255),
        outlineColor=game.rgb(0,0,0),
    ) {
        const message = spawnPoint.add([
            game.styledText(text, {
                fill: fill,
                outline: {
                    color: outlineColor,
                    width: outlineWidth,
                },
                size: textSize
            }),
            game.anchor("center"),
            game.pos(),
            game.opacity(1)
        ])

        messages.add(message)
        updateList()

        game.wait(5, () => {
            game.tween(
                1,
                0,
                1.0,
                (p) => message.opacity = p,
                game.easings.easeOutCubic
            )
        })

        game.wait(10, () => {
            messages.delete(message)
            message.destroy()
            updateList()
        })
    }

    function ImportantMessage(
        text: string
    ) {
        Log(text, game.rgb(211, 14, 14), game.rgb(113, 7, 7))
    }

    return { Log, ImportantMessage }
}