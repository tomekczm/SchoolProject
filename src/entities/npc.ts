// npcty mają zdefiniowaną ilość punktów pomiędzy którymi chodzą w kółko

import { Game, KAPLAYCtx } from "kaplay";


export function makeNPC(game: KAPLAYCtx, globals:any, punkty: any) {
    const speedNpc = 200;
    let punkt = 0;
    let czeka = false;
    const Npc = game.add([
        game.rect(32, 32),
        game.pos(punkty[0]),
        game.color(255, 105, 180),
        game.timer(),
        game.area(),
        "NPC"
    ]);
    Npc.onUpdate(() => {
        if (czeka) return;
        Npc.moveTo(punkty[punkt], speedNpc);
        if (Npc.pos.dist(punkty[punkt]) == 0) {
            czeka = true
            Npc.wait(2, () => {
                czeka = false;
                punkt++;
            })

            if (punkt == punkty.length-1) {
                punkt = -1;
            }
        }

        if (Npc.isColliding(globals.player)) { 
        czeka = true;
        Npc.wait(2, () => {
            czeka = false;
        })}
    })
}
        
    
    




/*export function addNPC(game) {
    npc = game.add([
        game.rect(100, 32),
        game.pos(10, 20),
        "Player"
    ])
}*/