import kaplay from "kaplay";
import { addPlayer } from "./entities/player";
import { makeNPC } from "./entities/npc";
import { testMap } from "./interface/map";
import { loadSpriteAsync } from "./interface/InterfaceButton";
import { Inventory } from "./interface/Inventory";
import { KillButton } from "./interface/KillButton";

export const game = kaplay();

const accessoriums = [
    [ "beanie" ],
    [ "mustache" ]
]

const SPRITE_GENERAL_INFO = {
    sliceX: 3,
}

game.loadRoot("./"); // A good idea for Itch.io publishing later
game.loadSprite("Panda", "sprites/player.png");
game.loadSprite("KNIFE_ICON", "sprites/KNIFE_ICON.png");
game.loadSprite("EMPTY", "sprites/EMPTY_IMAGE.png");
game.loadSprite("TARGET", "sprites/target-frame.png");
game.loadSprite("Wooden_Planks", "sprites/Planks.png");
game.loadSprite("Wall", "sprites/Wall.png");
game.loadSprite("NPC_anim", "sprites/Kirk_walking-sheet.png", SPRITE_GENERAL_INFO);
await loadSpriteAsync(game, "Blood", "sprites/BloodYes.png")
game.loadSprite("Slot", "sprites/slot.png", {
    sliceX: 2,
})
for(const accessoriumLayer of accessoriums) {
    for(const accessory of accessoriumLayer) {
        game.loadSprite(accessory, `sprites/${accessory}.png`,SPRITE_GENERAL_INFO)
    }
}

const alreadyCreatedOutfits: (string|null)[][] = []
const map = testMap(game);
const globals = {
    game,
    map,
    player: addPlayer(game, map),
    accessoriums,
    alreadyCreatedOutfits
}
export type Globals = typeof globals;

makeNPC(game,globals, [
        new game.Vec2(80, 200),
        new game.Vec2(400, 200),
        new game.Vec2(400, 80),
        new game.Vec2(80, 80),
    ], [
        new game.Vec2(500,250),
    ],
    )
makeNPC(game,globals, [
    new game.Vec2(500, 200),
    new game.Vec2(800, 200),
    new game.Vec2(800, 80),
    new game.Vec2(500, 80),
], [
    new game.Vec2(650,250),
],
true
)

    /*makeNPC(game,globals, [
        new game.Vec2(80, 400),
        new game.Vec2(400, 400),
        new game.Vec2(400, 600),
        new game.Vec2(80, 600)
    ],
    [
        new game.Vec2(80, 80)
    ]*/
   
Inventory(game, globals)