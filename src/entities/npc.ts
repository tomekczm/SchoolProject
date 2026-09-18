// npcty mają zdefiniowaną ilość punktów pomiędzy którymi chodzą w kółko

import { KAPLAYCtx } from "kaplay";


export function makeNPC(game: KAPLAYCtx) {
    const speedNpc = 200;
    let punkt = 0;
    const punkty = [
        new game.Vec2(80,400),
        new game.Vec2(400,400),
        new game.Vec2(400,80),
        new game.Vec2(80,80)
        
    ];
    const Npc = game.add([ 
        game.rect(32, 32),
        game.pos(80, 80),
        game.color(255, 105, 180),
        game.timer(),
    ]);
    Npc.onUpdate(() => {
        
        Npc.moveTo(punkty[punkt], speedNpc);
        if(Npc.pos.dist(punkty[punkt]) == 0  ){
            Npc.wait(20, () => {
                console.log("czekam")
             });
            punkt ++;
            if(punkt == 4){
                punkt = 0;
            }
        }

        
        
    });
    game.onCollide("Npc", "player", () => {
            
            game.destroy(Npc)
            })
}



/*export function addNPC(game) {
    npc = game.add([
        game.rect(100, 32),
        game.pos(10, 20),
        "Player"
    ])
}*/