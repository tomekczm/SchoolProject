import kaplay from "kaplay";
import { addPlayer } from "./entities/player";

export const game = kaplay();

game.loadRoot("./"); // A good idea for Itch.io publishing later
game.loadSprite("bean", "sprites/bean.png");

game.add([game.pos(120, 80), game.sprite("bean")]);

game.onClick(() => game.addKaboom(game.mousePos()));
addPlayer(game)