import { KAPLAYCtx, SpriteData } from "kaplay";
import { ACCESSORIUMS } from "./entities/npc";

const SPRITE_GENERAL_INFO = {
    sliceX: 3,
}

export function loadSpriteAsync(
    game: KAPLAYCtx,
    name: string,
    path: string,
    options?: Parameters<KAPLAYCtx["loadSprite"]>[2],
): Promise<SpriteData> {
    return new Promise((resolve, reject) => {
        game.loadSprite(name, path, options)
            .catch((err) => reject(err))
            .onLoad((data) => resolve(data))
    })
}

export async function loadSprites(game: KAPLAYCtx) {
    game.loadRoot("./"); // A good idea for Itch.io publishing later
    
    game.loadShaderURL("Grayscale", null, "shaders/Grayscale.frag")
    
    const spriteLoads = [
        loadSpriteAsync(game, "Panda", "sprites/player.png", { sliceX: 3 }),
        loadSpriteAsync(game, "KNIFE_ICON", "sprites/KNIFE_ICON.png", { sliceX: 2 }),
        loadSpriteAsync(game, "KNIFE_ICON-highlighted", "sprites/KNIFE_ICON-highlighted.png", { sliceX: 2 }),
        loadSpriteAsync(game, "EMPTY", "sprites/EMPTY_IMAGE.png"),
        loadSpriteAsync(game, "TARGET", "sprites/target-frame.png"),
        loadSpriteAsync(game, "Wooden_Planks", "sprites/Planks.png"),
        loadSpriteAsync(game, "Wall", "sprites/Wall.png"),
        loadSpriteAsync(game, "NPC_anim", "sprites/Kirk_walking-sheet.png", SPRITE_GENERAL_INFO),
        loadSpriteAsync(game, "Blood", "sprites/BloodYes.png"),
        loadSpriteAsync(game, "Slot", "sprites/slot.png", { sliceX: 2 }),
    ]
    for(const accessoriumLayer of ACCESSORIUMS) {
        for(const accessory of accessoriumLayer) {
            spriteLoads.push(loadSpriteAsync(game, accessory, `sprites/${accessory}.png`, SPRITE_GENERAL_INFO))
        }
    }
    await Promise.all(spriteLoads)
}
