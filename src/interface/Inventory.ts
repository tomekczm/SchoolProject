import { Color, GameObj, KAPLAYCtx, Key, SpriteData, TweenController, Vec2 } from "kaplay";
import { Globals } from "../main";
import { UIHoverEffect } from "../effects/UIHover";

export async function Inventory(game: KAPLAYCtx, globals: Globals) {
    let offset = 100;
    let slots = []
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
        slots[i] = sprite;
        UIHoverEffect(game, sprite)
        game.onKeyPress(keyMap[i], () => {
            if(slotEquipped !== undefined)
                slots[slotEquipped].frame = 0;
            if(slotEquipped === i) {
                slotEquipped = undefined;
                return;
            };
            slotEquipped = i;
            slots[i].frame = 1;
        })
    }


}