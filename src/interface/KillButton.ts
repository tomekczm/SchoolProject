import { AreaComp, ColorComp, Game, GameObj, PosComp, Vec2 } from "kaplay";
import { Context } from "../main";
import { InterfaceButton } from "./InterfaceButton";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { createBloodPool } from "../effects/BloodPool";
import { ScreenShake } from "../effects/ScreenShake";

const KNIFE_DISTANCE = 100;

type Npc = GameObj<PosComp | AreaComp>
export function KillButton(context: Context) {
    const game = context.game;


    const player = context.player;


    const npcsHovered = new Set<Npc>()

    function update() {
        if(npcsHovered.size === 0) context.keyHints.disableHint("Kill_Knife")
        else context.keyHints.enableHint("Kill_Knife")
    }

    const npcHovered = context.map.get("NPC") as Npc[];

    function onHovered(npc: Npc) {
        context.keyHints.enableHint("Kill_Knife");
        npcsHovered.add(npc)
        update()
        npc.tag("Focused")
    }

    npcHovered.forEach((n) => {
        game.debug.log(n.isHovering())
        if(n.isHovering()) onHovered(n)
    })

    const e1 = player.on("NpcHovered", onHovered)
    const e2 = player.on("NpcHoveredEnd", (npc: Npc) => {
        context.keyHints.disableHint("Kill_Knife");
        npcsHovered.delete(npc)
        update()
        npc.untag("Focused")
    })

    function getFirstNpc(): Npc | undefined {
        return npcsHovered.values().next().value
    }

    const e3 = context.game.onMousePress("left", () => {
        const targetedNpc = getFirstNpc()
        if (player.hidden || !targetedNpc) return;
        npcsHovered.delete(targetedNpc)
        update()
        ScreenShake(game)
        createBloodSplatter(game, targetedNpc.pos)
        createBloodPool(context, targetedNpc.pos)
        targetedNpc.trigger("Killed");
    })

    function clr() {
        context.keyHints.disableHint("Kill_Knife")
        for (const npc of npcsHovered) {
            npc.untag("Focused")
        }
        npcsHovered.clear()
        e1.cancel()
        e2.cancel()
        e3.cancel()
    }

    return {
        clear: clr
    }
}