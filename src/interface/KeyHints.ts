import { GameObj, PosComp } from "kaplay"
import { Context } from "../main"

interface KeyHint {
    icon_idx: number,
    text: string
}

type HintNames = "Kill_Knife" | "Talk_Npc" | "Drop" | "Grab" | "Exit" | "Use" | "Place"

const KeyHints: Record<HintNames, KeyHint> = {
    "Kill_Knife": {
        icon_idx: 0,
        text: "Kill"
    },
    "Talk_Npc": {
        icon_idx: 1,
        text: "Talk",
    },
    "Grab": {
        icon_idx: 1,
        text: "Grab",
    },
    "Drop": {
        icon_idx: 2,
        text: "Drop",
    },
    "Exit": {
        icon_idx: 3,
        text: "Exit"
    },
    "Use": {
        icon_idx: 4,
        text: "Use"
    },
    "Place": {
        icon_idx: 5,
        text: "Place"
    }
}

export function createKeyhintsHandler(ctx: Context) {
    const game = ctx.game;
    const holder = ctx.game.add([
        ctx.game.anchor("topright"),
        game.pos(game.width()-150, 20),
    ])
    const map = new Map<string, GameObj<PosComp>>()
    function enableHint(name: HintNames) {
        if(ctx.player.hidden) return;
        map.get(name)?.destroy()
        const hint = KeyHints[name];
        const newInstance = holder.add([
            game.pos(0,0),
            game.fixed(),
            game.anchor("right")
        ])
        const text = newInstance.add([
            game.styledText(hint.text, {
                width: 32,
                outline: {
                    color: game.rgb(0,0,0),
                    width: 10
                }
            })
        ])

        newInstance.add([
            game.rect(32,32),
            game.pos(-32 - 10, 0)
        ])
        
        map.set(name, newInstance);
        reorder()
    }

    function reorder() {
        let count = 0;
        for(const KeyHint of Object.keys(KeyHints)) {
            const obj = map.get(KeyHint)
            if(obj !== undefined) {
                obj.pos = game.vec2(0, count * 50)
                count += 1;
            }
        }
    }

    function disableHint(name: HintNames) {
        map.get(name)?.destroy()
        map.delete(name)
        reorder()
    }
    function disableAll() {
        for (const hint of map.values()) {
            hint.destroy()
        }
        reorder()
    }

    return {
        enableHint,
        disableHint,
        disableAll
    }
}