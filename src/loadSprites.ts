import { KAPLAYCtx, SpriteData } from "kaplay";
import { ACCESSORIUMS } from "./entities/npc";

const SPRITE_GENERAL_INFO = {
    sliceX: 3,
}

export function loadSpriteAsync(game: KAPLAYCtx, name: string, path: string): Promise<SpriteData> {
    return new Promise((resolve, reject) => {
        game.loadSprite(name, path)
            .catch((err) => reject(err))
            .onLoad((data) => resolve(data))
    })
}

export async function loadSprites(game: KAPLAYCtx) {
    game.loadRoot("./"); // A good idea for Itch.io publishing later
    
    game.loadShaderURL("Grayscale", null, "shaders/Grayscale.frag")
    
    game.loadSprite("Panda", "sprites/player.png", {
        sliceX: 3
    });
    game.loadSprite("KNIFE_ICON", "sprites/KNIFE_ICON.png", {
        sliceX: 2
    });
    game.loadSprite("EMPTY", "sprites/EMPTY_IMAGE.png");
    game.loadSprite("TARGET", "sprites/target-frame.png");
    game.loadSprite("Wooden_Planks", "sprites/Planks.png");
    game.loadSprite("Wall", "sprites/Wall.png");
    game.loadSprite("NPC_anim", "sprites/Kirk_walking-sheet.png", SPRITE_GENERAL_INFO);
    await loadSpriteAsync(game, "Blood", "sprites/BloodYes.png")
    game.loadSprite("Slot", "sprites/slot.png", {
        sliceX: 2,
    })
    for(const accessoriumLayer of ACCESSORIUMS) {
        for(const accessory of accessoriumLayer) {
            game.loadSprite(accessory, `sprites/${accessory}.png`,SPRITE_GENERAL_INFO)
        }
    }
}
