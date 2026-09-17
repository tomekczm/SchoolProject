// npcty mają zdefiniowaną ilość punktów pomiędzy którymi chodzą w kółko

import { KAPLAYCtx } from "kaplay";


export function makeNPC(game: KAPLAYCtx) {
    const speedNpc = 100;
    let punkt = 0;
    const punkty = [
        new game.Vec2(80,400),
        new game.Vec2(400,400)
    ];
    const Npc = game.add([ 
        game.rect(32, 32),
        game.pos(80, 80),
        game.color(0.5, 0.5, 1),
    ]);
    Npc.onUpdate(() => {
        
        Npc.moveTo(punkty[punkt], speedNpc);
        if(Npc.pos.dist(punkty[punkt]) == 0  ){
            punkt = 1;
        }
    });
    
}



/*export function addNPC(game) {
    npc = game.add([
        game.rect(100, 32),
        game.pos(10, 20),
        "Player"
    ])
}*/