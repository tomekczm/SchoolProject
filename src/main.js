import kaplay from "kaplay";
import { addPlayer } from "./entities/player";
import { makeNPC } from "./entities/npc";


export const game = kaplay();

game.loadRoot("./"); // A good idea for Itch.io publishing later
game.loadSprite("bean", "sprites/bean.png");

game.add([game.pos(120, 80), game.sprite("bean")]);

const globals = {
    player: addPlayer(game)
}

game.onClick(() => game.addKaboom(game.mousePos()));
makeNPC(game)
