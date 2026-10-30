// Odpowiedzialna za npc.ts = Elżbieta Bezulska
// jezeli jest cos w type script to tomek to robil yoyoyo

import { Game, GameObj, KAPLAYCtx, PosComp, SpriteComp, Vec2 } from "kaplay";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { spawnDeadNpc } from "./deadNpc";
import { Context } from "../main";
import { onTargetKilled, setTargetForGame } from "./target";


export type NpcOutfit = (string | null)[];

export const alreadyCreatedOutfits: NpcOutfit[] = [];

export const ACCESSORIUMS = [
    ["beanie"],
    ["mustache"]
]

// Tomasz
export function dressUpNpc(ctx: Context, npc: GameObj<SpriteComp>, outfit: NpcOutfit) {
    const decorationInst: GameObj<SpriteComp>[] = []
    const game = ctx.game;
    for (const clothe of outfit) {
        if (clothe === null) continue;
        decorationInst.push(npc.add([
            game.sprite(clothe),
            game.anchor("center")
        ]))
    }
    return decorationInst;
}

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
    let wasNearBody = false;

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
        if (type === "Stander") stan = Standing;

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
            "NPC",
            game.sentry({ include: "DeadBody" }, {
                lineOfSight: true,
                raycastExclude: ["npc", "Player"],
                fieldOfView: 360,
            })
        ])

        npc.onObjectsSpotted(game.debug.log)




        const outfitSprites = dressUpNpc(context, npc, outfit);

        npc.on("Killed", () => { // Dodane przez Tomasz Czarnecki
            spawnDeadNpc(
                context,
                npc.pos,
                outfit
            )
            if (isTarget) onTargetKilled(npc)
            if (isTarget === true) {
                game.debug.log("Target killed");
            } else {
                game.debug.log("Non-Target Killed");
            }
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
            outfitSprites.forEach((d) => d.frame = frame)
        }

        function doNothing() {
            setFrame(1);
        }

        function Standing() {
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
        // ucieczka do wybranego miejsca, pozniej to w map dodamy ten punkt
        function runAway() {
            const destination = game.vec2(79, 375);
            setFrame(0)
            npc.moveTo(destination, speedNpc);
            if (npc.pos.dist(destination) == 0) {
                game.debug.log("Am safe from Palestine")
                stan = doNothing;
            }
        }

        function detectedDeadBody() {
            game.debug.log("Npc saw a dead body and is running away");
            stan = runAway;
        }



        if (isTarget) setTargetForGame(context, npc, outfit)



        npc.onUpdate(() => {

            const deadBodies = context.map.get("DeadBody") as GameObj<PosComp>[]
            const isNearBody = deadBodies.some(
                (element) => npc.pos.dist(element.pos) < 100
            );


            ifTargetedBounceColor()
            if (stan !== undefined) stan()

            if (isNearBody && !wasNearBody) {
                detectedDeadBody();
            }
            wasNearBody = isNearBody;



            if (npc.isColliding(context.player)) {
                if (type === "Stander") {
                    return
                }
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


