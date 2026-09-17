import kaplay from "kaplay";

export const game = kaplay();

game.loadRoot("./"); // A good idea for Itch.io publishing later
game.loadSprite("bean", "sprites/bean.png");

game.add([game.pos(120, 80), game.sprite("bean")]);

game.onClick(() => k.addKaboom(k.mousePos()));

import "./entities/player"