import { GameObj, Vec2 } from "kaplay";
import { Globals } from "../main";
import { InterfaceButton } from "./InterfaceButton";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { createBloodPool } from "../effects/BloodPool";

const KNIFE_DISTANCE = 100;

export async function SpillButton(globals: Globals) {
    const game = globals.game;
    const { background, enable, disable, text, clear } = await InterfaceButton(globals);
    enable()
    text.frame = 1;

    return {
        clear
    }
}