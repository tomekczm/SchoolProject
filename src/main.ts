import kaplay from "kaplay";
import { addPlayer } from "./entities/player";
import { makeNPC } from "./entities/npc";
import { testMap } from "./interface/map";
import { KillInterface, loadSpriteAsync } from "./interface/KillInterface";
import { Inventory } from "./interface/Inventory";

export const game = kaplay();

game.loadRoot("./"); // A good idea for Itch.io publishing later
game.loadSprite("Panda", "sprites/player.png");
game.loadSprite("NPC_anim", "sprites/Kirk_walking-sheet.png", {
    sliceX: 3,
});
await loadSpriteAsync(game, "Blood", "sprites/BloodYes.png")
game.loadSprite("Slot", "sprites/slot.png")

testMap(game);

game.setLayers([
    "backgroud",
    "bodies",
    "vfx_under",
    "default",
], "default")

const globals = {
    player: addPlayer(game)
}
export type Globals = typeof globals;

makeNPC(game,globals, [
        new game.Vec2(80, 200),
        new game.Vec2(400, 200),
        new game.Vec2(400, 80),
        new game.Vec2(80, 80),
    ], [
        new game.Vec2(20, 20)
    ])

    makeNPC(game,globals, [
        new game.Vec2(80, 400),
        new game.Vec2(400, 400),
        new game.Vec2(400, 600),
        new game.Vec2(80, 600)
    ],
    [
        new game.Vec2(80, 80)
    ]
   )

KillInterface(game, globals)
Inventory(game, globals)