import { ColorComp, Game, GameObj, PosComp, Vec2 } from "kaplay";
import { Context } from "../main";
import { InterfaceButton } from "./InterfaceButton";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { createBloodPool } from "../effects/BloodPool";
import { ScreenShake } from "../effects/ScreenShake";

const KNIFE_DISTANCE = 100;

type Npc = GameObj<PosComp>
export async function KillButton(context: Context) {
    const game = context.game;


    const player = context.player;


    let npcsHovered = new Set()

    function update() {
        if(npcsHovered.size === 0) context.keyHints.disableHint("Kill_Knife")
        else context.keyHints.enableHint("Kill_Knife")
    }
    const e1 = player.on("NpcHovered", (npc: Npc) => {
        npcsHovered.add(npc)
        update()
        npc.tag("Focused")
    })
    const e2 = player.on("NpcHoveredEnd", (npc: Npc) => {
        npcsHovered.delete(npc)
        update()
        npc.untag("Focused")
    })

    function getFirstNpc() {
        return npcsHovered.values().next().value as unknown as GameObj<PosComp>
    }

    const e3 = context.game.onMousePress("left", () => {
        const targetedNpc = getFirstNpc()
        npcsHovered.delete(targetedNpc)
        update()
        if (player.hidden || !targetedNpc) return;
        ScreenShake(game)
        createBloodSplatter(game, targetedNpc.pos)
        createBloodPool(context, targetedNpc.pos)
        targetedNpc.trigger("Killed");
    })

    function clr() {
        const targetedNpc = getFirstNpc()
        context.keyHints.disableHint("Kill_Knife")
        targetedNpc?.untag("Focused")
        e1.cancel()
        e2.cancel()
        e3.cancel()
    }

    return {
        clear: clr
    }
}