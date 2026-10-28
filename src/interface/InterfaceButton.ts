import { Context } from "../main";
import { UIHoverEffect } from "../effects/UIHover";
import { loadSpriteAsync } from "../loadSprites";

export async function InterfaceButton(context: Context) {
    const game = context.game;
    const backgroundSprite = await loadSpriteAsync(game, "KILL_BACKGROUND", "sprites/KILL_BACKGROUND.png");
    game.loadSprite("KILL_TEXT", "sprites/BUTTON_TEXTS.png", {
        sliceX: 2
    });

    const BASE_BACKGROUND_SCALE = 3.0;
    let isEnabled = false;

    const background = game.add([
        game.scale(BASE_BACKGROUND_SCALE),
        game.sprite("KILL_BACKGROUND"), 
        game.anchor("center"),
        game.fixed(),
        game.pos(game.width()-150,game.height()-75),
        game.area(),
        game.timer(),
        game.shader("Grayscale", () => ({
            u_enabled: isEnabled ? 1 : 0
        })),
        "UI"
    ])
    
    const text = background.add([
        "UI",
        game.scale(1),
        game.sprite("KILL_TEXT"), 
        game.fixed(),
        game.anchor("center"),
        game.animate(),
    ])
    text.animate("scale", [ 
        new game.Vec2(1,1), 
        new game.Vec2(1.1,1.1) 
    ], {
        duration: 2,
        direction: "ping-pong",
        loops: Infinity,
        easing: game.easings.easeInOutSine
    })

    function enable() { isEnabled = true }
    function disable() { isEnabled = false; }

   UIHoverEffect(game, background)
    return {
        background, text, enable, disable, clear() {
            background.destroy();
            text.destroy()
        }
    }
}