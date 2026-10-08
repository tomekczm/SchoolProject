import { GameObj, KAPLAYCtx, SpriteData, Vec2 } from "kaplay";
import { Globals } from "../main";

const KNIFE_DISTANCE = 100;
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
    let targetedNpc: GameObj | undefined = undefined 
    let isHovered = false;
    const background = game.add([
        game.scale(3.0),
        game.sprite("KILL_BACKGROUND"), 
        game.fixed(),
        game.pos(game.width()-300,game.height()-150),
        game.area(),
        game.shader("Grayscale", () => ({
            u_enabled: targetedNpc !== undefined ? 1 : 0
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
    const player = globals.player;
    game.onUpdate(() => {
        let targetFound = false
        for (const npc of game.get("NPC")) {
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
    })

    background.onClick(() => {
        if(targetedNpc) targetedNpc.trigger("Killed")
    })
}