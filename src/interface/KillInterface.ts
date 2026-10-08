import { KAPLAYCtx, SpriteData, Vec2 } from "kaplay";
import { Globals } from "../main";

function loadSpriteAsync(game: KAPLAYCtx, name: string, path: string): Promise<SpriteData> {
    return new Promise((resolve, reject) => {
        game.loadSprite(name, path)
            .catch((err) => reject(err))
            .onLoad((data) => resolve(data))
    })
}

export async function KillInterface(game: KAPLAYCtx, globals: Globals) {
    const backgroundSprite = await loadSpriteAsync(game, "KILL_BACKGROUND", "sprites/KILL_BACKGROUND.png");
    game.loadSprite("KILL_TEXT", "sprites/KILL_TEXT.png");
    game.loadShaderURL("Grayscale", null, "shaders/Grayscale.frag")
    const background = game.add([
        game.scale(3.0),
        game.sprite("KILL_BACKGROUND"), 
        game.fixed(),
        game.pos(game.width()-300,game.height()-150),
        game.area(),
        game.shader("Grayscale", () => ({
            u_enabled: globals.player.is("IN_RANGE") ? 1 : 0
        }))
    ])
    
    const killText = background.add([
        game.scale(1),
        game.sprite("KILL_TEXT"), 
        game.fixed(),
        game.anchor("center"),
        game.pos(backgroundSprite.width/2, backgroundSprite.height/2),
        game.animate(),
    ])
    killText.animate("scale", [ 
        new game.Vec2(1,1), 
        new game.Vec2(1.1,1.1) 
    ], {
        duration: 2,
        direction: "ping-pong",
        loops: Infinity,
        easing: game.easings.easeInOutSine
    })

    background.onHover(() => {
        console.log(globals.player.is("IN_RANGE"))
    })
}