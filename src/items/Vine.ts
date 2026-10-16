import { KillButton } from "../interface/KillButton";
import { SpillButton } from "../interface/SpillButton";
import { Globals } from "../main";
import { Item } from "./Item";

let clear: (() => void) | undefined = undefined

export const wine: Item = {
    icon: "KNIFE_ICON",
    onEquip: async function (ctx: Globals): Promise<void> {
        clear?.();
        clear = (await SpillButton(ctx)).clear;
    },
    onUnequip: function (ctx: Globals): void {
       clear?.();
       clear = undefined;
    }
}