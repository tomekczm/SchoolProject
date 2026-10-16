import { KillButton } from "../interface/KillButton";
import { Globals } from "../main";
import { Item } from "./Item";

let clear: (() => void) | undefined = undefined

export const knife: Item = {
    icon: "KNIFE_ICON",
    onEquip: async function (ctx: Globals): Promise<void> {
        clear?.();
        clear = (await KillButton(ctx)).clear;
    },
    onUnequip: function (ctx: Globals): void {
       clear?.();
       clear = undefined;
    }
}