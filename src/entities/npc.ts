// npcty mają zdefiniowaną ilość punktów pomiędzy którymi chodzą w kółko

import { Game, KAPLAYCtx } from "kaplay";


export function makeNPC(game: KAPLAYCtx, globals:any, punkty: any) {
    const speedNpc = 200;
    let punkt = 0;
    let czeka = false;
    const Npc = game.add([
        game.pos(punkty[0]),
        game.timer(),
        game.area(),
        game.anchor("center"),
        game.sprite("NPC_anim"),
        "NPC"
    ]);
    //Npc po dotknieciu idzie na inne miejsce
    Npc.on("Event", () => {
            czeka = true;
            Npc.frame = 0;
            game.debug.log("time");
            Npc.wait(1, () => { 
                Npc.moveTo(punkty[4], speedNpc);
            })
        })

    Npc.onUpdate(() => {
        

        if (czeka) {
            Npc.frame = 1;
            return;}

        Npc.moveTo(punkty[punkt], speedNpc);
        if (Npc.pos.dist(punkty[punkt]) == 0) {
            czeka = true
            Npc.wait(2, () => {
                Npc.frame = 0;
                czeka = false;
                punkt++;
            })

            if (punkt == punkty.length-1) {
                punkt = -1;

            }
        }

        if (Npc.isColliding(globals.player)) { 
            Npc.trigger("Event");
        /*czeka = true;
        Npc.wait(2, () => {
            Npc.frame = 0;
            czeka = false;*/
        
    }
        
    })
}

    




