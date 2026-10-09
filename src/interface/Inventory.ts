import { GameObj, KAPLAYCtx, SpriteData, TweenController, Vec2 } from "kaplay";
import { Globals } from "../main";

export async function Inventory(game: KAPLAYCtx, globals: Globals) {
    let offset = 100;
    for(let i = 0; i < 5; i++) {
        game.add([
            game.sprite("Slot"),
            game.pos(50 + (i * offset), 50),
            game.scale(3),
            game.fixed(),
            game.anchor("center"),
        ])
    }
}