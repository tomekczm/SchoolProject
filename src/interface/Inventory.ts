import { AnchorComp, AreaComp, Color, ColorComp, FixedComp, GameObj, KAPLAYCtx, Key, PosComp, ScaleComp, SpriteComp, SpriteData, TimerComp, TweenController, Vec2 } from "kaplay";
import { Context } from "../main";
import { UIHoverEffect } from "../effects/UIHover";
import { knife } from "../items/Knife";
import { Item } from "../items/Item";
import { wine } from "../items/Vine";

type Slot = GameObj<SpriteComp | AnchorComp | PosComp | ScaleComp | FixedComp | TimerComp | AreaComp | ColorComp>;
type Icon = GameObj<SpriteComp | AnchorComp>;

export async function Inventory(ctx: Context) {
    const { game } = ctx;
    let offset = 100;
    let slots: Slot[] = []
    let items: (Item | undefined)[] = []
    let icons: Icon[] = []
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

        function onInteraction() {
            if(slotEquipped !== undefined) {
                slots[slotEquipped].frame = 0;
                items[slotEquipped]?.onUnequip(ctx);
            }
            if(slotEquipped === i) {
                slotEquipped = undefined;
                return;
            };
            slotEquipped = i;
            slots[i].frame = 1;
            items[i]?.onEquip(ctx)
        }


        sprite.onClick(() => {
            onInteraction()
        })

        game.onKeyPress(keyMap[i], () => {
            onInteraction()
        })
    }

    function setSlot(idx: number, item: Item | undefined) {
        if(item !== undefined) {
            items[idx] = item;
            icons[idx].sprite = item.icon;
            icons[idx].frame = item.iconFrame;
        } else {
            items[idx] = undefined;
            icons[idx].sprite = "EMPTY";
            icons[idx].frame = 0;
        }
    }
    function consume() {
        if(slotEquipped !== undefined) setSlot(slotEquipped, undefined)
    }
    function dropEquipped() {
        if(slotEquipped === undefined) return;

        const equippedSlot = slotEquipped;
        const equippedItem = items[equippedSlot];
        slotEquipped = undefined;
        slots[equippedSlot].frame = 0;
        setSlot(equippedSlot, undefined);
        equippedItem?.onUnequip(ctx);
    }
    return {
        setSlot,
        consume,
        dropEquipped
    }
}