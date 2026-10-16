// Odpowiedzialna za npc.ts = Elżbieta Bezulska

import { Game, KAPLAYCtx } from "kaplay";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { spawnDeadNpc } from "./deadNpc";
import { Globals } from "../main";


export function makeNPC(game: KAPLAYCtx, globals: Globals, punkty: any, event:any, isTarget: boolean = false) {
    const speedNpc = 200;
    let punkt = 0;
    let czeka = false;
    
    const Npc = globals.map.add([
        game.pos(punkty[0]),
        game.timer(),
        game.area(),
        game.body(),
        game.color(),
        game.anchor("center"),
        game.sprite("NPC_anim"),
        game.tile(),
        game.agent({ speed: 150, allowDiagonals: false }), 
        "NPC"
    ]);

    let stan = walking;
    
    function walking() {
        Npc.frame = 0;
        Npc.moveTo(punkty[punkt], speedNpc);
        //game.debug.log(game.time());
        if (Npc.pos.dist(punkty[punkt]) == 0) {
            stan = Stand;
            Npc.wait(2, () => {
                if(stan != Stand) return
                stan = walking;
            })
            punkt++;
            if (punkt == punkty.length) {
                punkt = 0;
            }
        }
    }

    function Stand() {

        Npc.frame = 1;
    }
    function standCollision(){
        Npc.frame = 1;
    }
    function eventtrigger() {
        // wywala wszystko w chuj
        //Npc.setTarget(event[0])
        //game.debug.log(Npc.isTargetReached())
    }

    Npc.wait(10, () => {
        stan = eventtrigger;
    })

    Npc.onUpdate(() => {
        
        Npc.on("Killed", () => { // Dodane przez Tomasz Czarnecki
            spawnDeadNpc(game, Npc.pos)
            Npc.destroy()
        })

        if(Npc.is("Focused")){ // Dodane przez Tomasz Czarnecki
            const ANIMATION_SPEED = 2;
            const factor = (Math.sin(game.time()*ANIMATION_SPEED) + 1) / 2
            Npc.color = new game.Color(255,255/2,255/2).lerp(
                new game.Color(255, 0, 0),
                factor
            );
        }else{
            Npc.color = game.Color.fromHex("#ffffff");
        }
        stan()

        if (Npc.isColliding(globals.player)) {
            if(stan === eventtrigger){
                stan = standCollision;
                Npc.wait(2, () => {
                    if(stan != standCollision) return
                    stan = eventtrigger;
                })
                return
            }
            stan = standCollision;
            Npc.wait(2, () => {
                if(stan != standCollision) return
                stan = walking;
            })
        }

        
    })
    Npc.onCollide("Wall", (wall, col) => {
        Npc.moveBy(col!.displacement);
    });


    }



