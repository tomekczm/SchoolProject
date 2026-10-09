import { GameObj, KAPLAYCtx, SpriteData, TweenController, Vec2 } from "kaplay";
import { Globals } from "../main";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { createBloodPool } from "../effects/BloodPool";

const KNIFE_DISTANCE = 100;
export function loadSpriteAsync(game: KAPLAYCtx, name: string, path: string): Promise<SpriteData> {
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

    const BASE_BACKGROUND_SCALE = 3.0;

    const background = game.add([
        game.scale(BASE_BACKGROUND_SCALE),
        game.sprite("KILL_BACKGROUND"), 
        game.anchor("center"),
        game.fixed(),
        game.pos(game.width()-150,game.height()-75),
        game.area(),
        game.timer(),
        game.shader("Grayscale", () => ({
            u_enabled: targetedNpc !== undefined ? 1 : 0
        }))
    ])
    
    const killText = background.add([
        game.scale(1),
        game.sprite("KILL_TEXT"), 
        game.fixed(),
        game.anchor("center"),
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


    let scaleDown: TweenController | undefined;
    let scaleUp: TweenController | undefined;

    let scaleFactor = 1.1;
    let speed = 0.1;

    let upscaled = new game.Vec2(BASE_BACKGROUND_SCALE * scaleFactor);
    let normal = background.scale;
    background.onHover(() => {
        scaleDown?.cancel()
        scaleUp?.cancel()
        const dist = background.scale.sub(upscaled).dist()
        scaleUp = background.tween(
            background.scale,
            upscaled,
            dist * speed,
            (v) => background.scaleTo(v)
        )
    })
    background.onHoverEnd(() => {
        scaleDown?.cancel()
        scaleUp?.cancel()
        const dist = background.scale.sub(normal).dist()
        scaleDown = background.tween(
            background.scale,
            new game.Vec2(BASE_BACKGROUND_SCALE),
            dist * speed,
            (v) => background.scaleTo(v)
        )
    })

    background.onClick(() => {
        if(!targetedNpc) return;
        createBloodSplatter(game, targetedNpc.pos)
        createBloodPool(game, targetedNpc.pos)
        targetedNpc.trigger("Killed")
        targetedNpc = undefined

    })
}