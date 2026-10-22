import { GameObj, Vec2 } from "kaplay";
import { Globals } from "../main";
import { InterfaceButton } from "./InterfaceButton";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { createBloodPool } from "../effects/BloodPool";
import { ScreenShake } from "../effects/ScreenShake";

const KNIFE_DISTANCE = 100;

export async function KillButton(globals: Globals) {
    const game = globals.game;
    const { background, enable, disable, text, clear } = await InterfaceButton(globals);

    const player = globals.player;
    let targetedNpc: GameObj | undefined = undefined 
    background.onUpdate(() => {
        let targetFound = false
        for (const npc of globals.map.get("NPC")) {
            const pos: Vec2 = npc.pos;
            if (pos.dist(player.pos) <= KNIFE_DISTANCE) {
                if (!player.is("IN_RANGE")) player.tag("IN_RANGE")
                if (!npc.is("Focused")) npc.tag("Focused")
                targetedNpc = npc;
                targetFound = true;
            } else {
                if (npc.is("Focused") && npc !== targetedNpc) npc.untag("Focused")
                player.untag("IN_RANGE")
            }
        }
        if(!targetFound) {
            targetedNpc?.untag("Focused")
            targetedNpc = undefined;
        }
        if(targetedNpc !== undefined) enable() 
            else disable()
    })

    background.onClick(() => {

        if(!targetedNpc) return;
        ScreenShake(game)
        createBloodSplatter(game, targetedNpc.pos)
        createBloodPool(globals, targetedNpc.pos)
        targetedNpc.trigger("Killed")
        targetedNpc = undefined
    })

    function clr() {
        clear()
        targetedNpc?.untag("Focused")
    }

    return {
        clear: clr
    }
}