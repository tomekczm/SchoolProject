// Odpowiedzialna za npc.ts = Elżbieta Bezulska

import { Game, GameObj, KAPLAYCtx, SpriteComp } from "kaplay";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { spawnDeadNpc } from "./deadNpc";
import { Globals } from "../main";
import { setTarget } from "./target";


export function makeNPC(game: KAPLAYCtx, globals: Globals, punkty: any, event:any, isTarget: boolean = false) {
    const speedNpc = 200;
    let punkt = 0;
    let czeka = false;

    // generate unique outfit
    function generateOutfit() {
        let outfit = []
        for(const accesoriums of globals.accessoriums) {
            let rand = game.randi(0, accesoriums.length+1)
            if(rand === 0) {
                outfit.push(null)
                continue;
            };
            const accessory = accesoriums[rand-1]
            outfit.push(accessory)
        }
        for(const pastOutfit of globals.alreadyCreatedOutfits) {
            if(pastOutfit.every((v, i) => v === outfit[i])) return generateOutfit()
        }

        globals.alreadyCreatedOutfits.push(outfit)
        return outfit;
    }

    const list = [
        game.pos(punkty[0]),
        game.timer(),
        game.area(),
        game.body(),
        game.color(),
        game.anchor("center"),
        game.sprite("NPC_anim"),
        game.z(1),
        game.tile(),
        game.agent({ speed: 150, allowDiagonals: false }), 
        "NonUI",
        "NPC"
    ]
    
    if(isTarget) list.push("Target")

    const Npc = globals.map.add(list);

    const decorationInst: GameObj<SpriteComp>[] = []
    const outfit = generateOutfit()
    for(const clothe of outfit) {
        if(clothe === null) continue;
        decorationInst.push(Npc.add([
            game.sprite(clothe),
            game.anchor("center")
        ]))
    }

    let stan = walking;
    
    function setFrame(frame: number) {
        Npc.frame = frame;
        decorationInst.forEach((d) => d.frame = frame)
    }

    function walking() {
        setFrame(0)
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

        setFrame(1)
    }
    function standCollision(){
        setFrame(1)
    }
    function eventtrigger() {
        // wywala wszystko w chuj
        //Npc.setTarget(event[0])
        //game.debug.log(Npc.isTargetReached())
    }

    Npc.wait(10, () => {
        stan = eventtrigger;
    })
    Npc.on("Killed", () => { // Dodane przez Tomasz Czarnecki
            spawnDeadNpc(globals, Npc.pos)
            Npc.destroy()
        })
        
    Npc.onUpdate(() => {
        
        

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

    if(isTarget) setTarget(globals, outfit)
}



