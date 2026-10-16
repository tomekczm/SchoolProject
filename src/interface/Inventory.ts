import { AnchorComp, Color, GameObj, KAPLAYCtx, Key, SpriteComp, SpriteData, TweenController, Vec2 } from "kaplay";
import { Globals } from "../main";
import { UIHoverEffect } from "../effects/UIHover";
import { knife } from "../items/Knife";
import { Item } from "../items/Item";
import { wine } from "../items/Vine";

export async function Inventory(game: KAPLAYCtx, globals: Globals) {
    let offset = 100;
    let slots = []
    let items: Item[] = []
    let icons: GameObj<SpriteComp | AnchorComp>[] = []
    let slotEquipped: number | undefined = undefined;

    const keyMap: Key[] = ['1', '2', '3', '4', '5', '6']

    for(let i = 0; i < 5; i++) {
        const sprite = game.add([
            game.sprite("Slot"),
            game.pos(50 + (i * offset), 50),
            game.scale(3),
            game.fixed(),
            game.anchor("center"),
            game.timer(),
            game.area(),
            game.color(),
        ])
        const icon = sprite.add([
            game.sprite("EMPTY", {
                width: 32,
                height: 32
            }),
            game.anchor("center")
        ])
        icons[i] = icon;
        slots[i] = sprite;
        UIHoverEffect(game, sprite)
        game.onKeyPress(keyMap[i], () => {
            if(slotEquipped !== undefined) {
                slots[slotEquipped].frame = 0;
                items[slotEquipped]?.onUnequip(globals);
            }
            if(slotEquipped === i) {
                slotEquipped = undefined;
                return;
            };
            slotEquipped = i;
            slots[i].frame = 1;
            items[i]?.onEquip(globals)
        })
    }

    function setSlot(idx: number, item: Item) {
        items[idx] = item;
        icons[idx].sprite = item.icon;
    }
    setSlot(0, knife)
    setSlot(1, wine)
    return {
        
    }
}