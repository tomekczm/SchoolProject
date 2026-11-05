// Odpowiedzialna za npc.ts = Elżbieta Bezulska
// jezeli jest cos w type script to tomek to robil yoyoyo

import { Game, GameObj, KAPLAYCtx, PosComp, SpriteComp, Vec2 } from "kaplay";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { spawnDeadNpc } from "./deadNpc";
import { Context } from "../main";
import { onTargetKilled, setTargetForGame } from "./target";
import { NpcDialogue } from "./NpcDialogue";


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
    let wasNearBlood = false;
    let role = "Runner";
    const safePlace = game.vec2(80, 375);
    let goToBlood = game.vec2(0, 0);
    let isbloodOrNot = false;
    let checkedSplits = new Set();




    function setPoints(newPunkty: Array<Vec2>) {
        punkty = newPunkty;
    }
    function setRole(newRole: string) {
        role = newRole;
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
            NpcDialogue(context),
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
                 context.logger.ImportantMessage("Target killed");
            } else {
                 context.logger.ImportantMessage("Non-Target Killed");
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

        function runAway() {
            setFrame(0)
            npc.moveTo(safePlace, speedNpc);
            if (npc.pos.dist(safePlace) == 0) {
                 context.logger.ImportantMessage("Am safe from Palestine")
                stan = doNothing;
            }
        }

        function detectedDeadBody() {
            context.logger.ImportantMessage("Npc saw a dead body and is running away");
            if (role === "Runner") {
                stan = runAway;
            }



        }
        function detectedBloodSplit() {
            context.logger.ImportantMessage("Npc saw smth suspicious")
            stan = investigateBlood;

        }
        function investigateBlood() {

            npc.moveTo(goToBlood, speedNpc);
            if (npc.pos.dist(goToBlood) == 0) {
                stan = bloodOrNot;
                npc.wait(3, () => {
                    if (isbloodOrNot === true) {
                         context.logger.ImportantMessage("npc discover the Blood stain!");
                    } else {
                         context.logger.ImportantMessage("Npc recognize that it was only Wine");
                      
                        stan = walkingFromPointToPoint;

                    }

                })
            }
        }
        function bloodOrNot() {
            setFrame(1);


        }



        if (isTarget) setTargetForGame(context, npc, outfit)



        npc.onUpdate(() => {

            /*
               to gowno sentry nie działa, narazie npc widzi przez sciany ale moze
               to sie pozniej naprawi albo gre sie zbuduje pod ta mechanike, *dzwieki*
           */
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

            const BloodSplatt = context.map.get("Stain") as GameObj<PosComp>[]
            const BloodNearby = BloodSplatt.filter( // some sprawdza jakie ciala sa 
                (element) => npc.pos.dist(element.pos) < 100 && !checkedSplits.has(element)
            );


            const isNearBlood = BloodNearby.length !== 0
            if (isNearBlood && !wasNearBlood) {
                goToBlood = game.vec2(BloodNearby[0].pos.x, BloodNearby[0].pos.y);
                isbloodOrNot = BloodNearby[0].is("Blood");
                checkedSplits.add(BloodNearby[0])
                detectedBloodSplit();
            }
            wasNearBlood = isNearBlood;


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

        return npc
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
        create,
        setRole
    };
    // dodajemy wampira ktory wyssa kfrew zabbije targeta, bedzie target vampir ktory musi wypic wino z cozsnkiem by umrzec
}


