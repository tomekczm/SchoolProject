import kaplay from "kaplay";
import { addPlayer } from "./entities/player";
import { makeNPC } from "./entities/npc";
import { testMap } from "./interface/map";

export const game = kaplay();

game.loadRoot("./"); // A good idea for Itch.io publishing later
game.loadSprite("bean", "sprites/bean.png");
game.loadSprite("NPC_anim", "sprites/Kirk_walking-sheet.png", {
    sliceX: 2,
});

testMap(game);
game.add([game.pos(120, 80), game.sprite("bean")]);

const globals = {
    player: addPlayer(game)
}

game.onClick(() => game.addKaboom(game.toWorld(game.mousePos())));

makeNPC(game,globals, [
        new game.Vec2(80, 200),
        new game.Vec2(400, 200),
        new game.Vec2(400, 80),
        new game.Vec2(80, 80)
    ])

    makeNPC(game,globals, [
        new game.Vec2(80, 400),
        new game.Vec2(400, 400),
        new game.Vec2(400, 600),
        new game.Vec2(80, 600)
    ])

