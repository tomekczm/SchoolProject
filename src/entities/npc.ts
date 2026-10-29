// Odpowiedzialna za npc.ts = Elżbieta Bezulska

import { Game, GameObj, KAPLAYCtx, SpriteComp, Vec2 } from "kaplay";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { spawnDeadNpc } from "./deadNpc";
import { Context } from "../main";
import { setTargetForGame } from "./target";

export const alreadyCreatedOutfits: (string | null)[][] = [];

export const ACCESSORIUMS = [
    ["beanie"],
    ["mustache"]
]

export function createNPC(context: Context) {


    const { game } = context
    let outfit: (string | null)[] = [];

    function generateOutfit() { //dodał, tomasz Czarnecki losowy outfit akcesorie
        let outfit = []
        for (const accesoriums of ACCESSORIUMS) {
            let rand = game.randi(0, accesoriums.length + 1)
            if (rand === 0) {
                outfit.push(null)
                continue;
            };
            const accessory = accesoriums[rand - 1]
            outfit.push(accessory)
        }
        for (const pastOutfit of alreadyCreatedOutfits) {
            if (pastOutfit?.every((v, i) => v === outfit[i])) return generateOutfit()
        }

        alreadyCreatedOutfits.push(outfit)
        return outfit;
    }
//punkty, typy, targety
    let punkty: Array<Vec2> = []
    let isTarget = false;
    let type: string = "Walker";

    function setPoints(newPunkty: Array<Vec2>) {
        punkty = newPunkty;
    }

    function setType(newType: string) {
        type = newType;
    }
    function setTarget(newTarget: boolean) {
        isTarget = newTarget;
    }

    //tworzenie npc 
    function create() {
        let stan: (() => any) | undefined = undefined;
        if (type === "Walker") stan = walkingFromPointToPoint;

        console.log(punkty)
        const npc = context.map.add([
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
        ])

        const decorationInst: GameObj<SpriteComp>[] = []

        /*
        for (const clothe of outfit) {
            if (clothe === null) continue;
            decorationInst.push(npc.add([
                game.sprite(clothe),
                game.anchor("center")
            ]))
        }*/

        npc.on("Killed", () => { // Dodane przez Tomasz Czarnecki
            spawnDeadNpc(context, npc.pos)
            npc.destroy()
        })

        //kolor czerwony na npc jak mozna go zabic yoyoyoyoyoyyoyo
        
        function ifTargetedBounceColor() {
            if (npc.is("Focused")) { // Dodane przez Tomasz Czarnecki
                const ANIMATION_SPEED = 2;
                const factor = (Math.sin(game.time() * ANIMATION_SPEED) + 1) / 2
                npc.color = new game.Color(255, 255 / 2, 255 / 2).lerp(
                    new game.Color(255, 0, 0),
                    factor
                );
            } else {
                npc.color = game.Color.fromHex("#ffffff");
            }
        }

        function setFrame(frame: number) {
            npc.frame = frame;
            decorationInst.forEach((d) => d.frame = frame)
        }

        function doNothing() {
            setFrame(1);
        }

        function walkingFromPointToPoint() {
            setFrame(0)
            npc.moveTo(punkty[punkt], speedNpc);
            if (npc.pos.dist(punkty[punkt]) == 0) {
                stan = doNothing;
                npc.wait(2, () => {
                    if (stan != doNothing) return
                    stan = walkingFromPointToPoint;
                })
                punkt++;
                if (punkt == punkty.length) {
                    punkt = 0;
                }
            }

        }
        function Collision() {
            setFrame(1);
        }

        if(isTarget) setTargetForGame(context, outfit)

        npc.onUpdate(() => {
            ifTargetedBounceColor()
            if (stan !== undefined) stan()

            if (npc.isColliding(context.player)) {
                stan = Collision;
                npc.wait(2, () => {
                    if (stan != Collision) return
                    stan = walkingFromPointToPoint;
                })
            }

        })

    }

    function setOutfitToRandom() {
        outfit = generateOutfit()
    }


    const speedNpc = 200;
    let punkt = 0;



    return {
        setPoints,
        isTarget,
        type,
        setType,
        setTarget,
        setOutfitToRandom,
        create
    };
    // dodajemy wampira ktory wyssa kfrew zabbije targeta, bedzie target vampir ktory musi wypic wino z cozsnkiem by umrzec
}


