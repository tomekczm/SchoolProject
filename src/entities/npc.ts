// Odpowiedzialna za npc.ts = Elżbieta Bezulska
// jezeli jest cos w type script to tomek to robil yoyoyo

import { Game, GameObj, KAPLAYCtx, PosComp, SpriteComp, Vec2 } from "kaplay";
import { createBloodPool } from "../effects/BloodPool";
import { createBloodSplatter } from "../effects/BloodSplatter";
import { spawnDeadNpc } from "./deadNpc";
import { Context } from "../main";
import { onTargetKilled, setTargetForGame } from "./target";
import { NpcDialogue, NpcDialogueComp } from "./NpcDialogue";


export type NpcOutfit = (string | null)[];
type NpcType = "Walker" | "Stander" | "Drinker";

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


    let customNpcDialogueComponent: undefined | NpcDialogueComp;
    const { game } = context
    let outfit: (string | null)[] = [];

    function generateOutfit(): NpcOutfit {
        const possibleOutfits = ACCESSORIUMS.reduce<NpcOutfit[]>(
            (outfits, accessories) =>
                outfits.flatMap((outfit) =>
                    [null, ...accessories].map((accessory) => [...outfit, accessory])
                ),
            [[]]
        );

        const unusedOutfits = possibleOutfits.filter(
            (candidate) =>
                !alreadyCreatedOutfits.some(
                    (past) =>
                        past.length === candidate.length &&
                        past.every((item, index) => item === candidate[index])
                )
        );

        const choices = unusedOutfits.length > 0 ? unusedOutfits : possibleOutfits;
        const outfit = choices[game.randi(0, choices.length)];

        alreadyCreatedOutfits.push(outfit);
        return outfit;
    }



    //punkty, typy, targety
    let punkty: Array<Vec2> = []
    let isTarget = false;
    let type: NpcType = "Walker";
    let wasNearBody = false;
    let wasNearBlood = false;
    let reaction = "Runner";
    const safePlace = game.vec2(1030, 564);
    let goToBlood = game.vec2(0, 0);
    let isbloodOrNot = false;
    let checkedSplits = new Set();
    let isInvestigate = false;
    let spoke = false;
    let number = 0;

    function setPoints(newPunkty: Array<Vec2>) {
        punkty = newPunkty;
    }
    function setReaction(newReaction: string) {
        reaction = newReaction;
    }

    function setType(newType: NpcType) {
        type = newType;
    }
    function setTarget(newTarget: boolean) {
        isTarget = newTarget;
    }
    function setNpcDialogue(newDialogueComp: NpcDialogueComp) {
        customNpcDialogueComponent = newDialogueComp;
    }


    //tworzenie npc
    function create() {
        let stan: (() => any) | undefined = undefined;
        let punkt = 0;
        let completedLoops = 0;
        let hasGoneToWine = false;
        let currentTarget: undefined | Vec2;

        if (type === "Walker" || type === "Drinker") stan = walkingFromPointToPoint;
        if (type === "Stander") stan = Standing;
        

        const npcDialogueComponent = customNpcDialogueComponent || NpcDialogue(context)

        const npc = context.map.add([
            game.pos(punkty[0]),
            game.timer(),
            game.area({
                scale: 0.5,
                collisionIgnore: ["NPC"]
            }),
            game.body(),
            game.color(),
            game.anchor("center"),
            game.sprite("NPC_anim"),
            npcDialogueComponent,
            game.z(10),
            game.tile(),
            game.agent({
                speed: speedNpc,
                allowDiagonals: false,
            }),
            "NonUI",
            "NPC",

        ])

        npc.onHover(() => context.player.trigger("NpcHovered", npc))
        npc.onHoverEnd(() => context.player.trigger("NpcHoveredEnd", npc))

        if (reaction === "Runner" && punkty.length > 1) setTargetSafe(punkty[0])
        //tomek nie badz zly D;
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
                punkt++;
                if (punkt == punkty.length) {
                    punkt = 0;
                    completedLoops++;
                }

                if (type === "Drinker" && completedLoops >= 1 && !hasGoneToWine) {
                    hasGoneToWine = true;
                    stan = gotoWine;
                    return;
                }

                stan = doNothing;
                npc.wait(2, () => {
                    if (stan != doNothing) return
                    stan = walkingFromPointToPoint;
                })
            }
        }
        function gotoWine() {
            if (type !== "Drinker") {
                stan = type === "Stander" ? Standing : walkingFromPointToPoint;
                return;
            }

            const glasses = context.map.get("WineGlass") as GameObj<PosComp>[];
            const glass = glasses.reduce<GameObj<PosComp> | undefined>(
                (nearest, candidate) =>
                    !nearest || npc.pos.dist(candidate.pos) < npc.pos.dist(nearest.pos)
                        ? candidate
                        : nearest,
                undefined
            );
            if (!glass) {
                stan = walkingFromPointToPoint;
                return;
            }

            setFrame(0);
            if (npc.pos.dist(glass.pos) > 50) {
                npc.moveTo(glass.pos, speedNpc);
                return;
            }

            const isPoisoned = glass.is("Poisoned");
            stan = doNothing;
            
            
            if (!isPoisoned) {
                context.logger.ImportantMessage("Npc drinks the wine");
                glass.destroy();
                npc.wait(2, () => {
                stan = walkingFromPointToPoint;
                })
                
                return;
            }


            context.logger.ImportantMessage("Npc drinks the poisoned wine");
            glass.destroy();
            npc.wait(1, () => {
                npc.trigger("Killed");
                
            })
            
            stan = doNothing;
        }

        function Collision() {
            setFrame(1);
        }

        function setTargetSafe(target: Vec2) {
            if(currentTarget && target.dist(currentTarget) === 0) return
            currentTarget = target;
            npc.setTarget(target)
        }

        // poprawiony runAway bo byly lagi 
        function runAway() {
            //move to

            setTargetSafe(safePlace);
            if (npc.pos.dist(safePlace) == 0) {
                npc.destroy();
            }
        }

        function startRunningAway() {
            stan = runAway;
            setTargetSafe(safePlace);
        }

        function detectedDeadBody() {
            context.logger.ImportantMessage("Npc saw a dead body");
            npc.getLogger().Log("O boże to ciało!");
            if (reaction === "Runner") {
                startRunningAway();
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
                        npc.getLogger().Log("To krew!!!!");
                        startRunningAway();
                    } else {
                        npc.getLogger().Log("To tylko plama po winie");
                        stan = walkingFromPointToPoint;

                    }

                })
            }
        }
        function bloodOrNot() {
            setFrame(1);


        }

        function investigate(){

            if(isInvestigate){
                stan = Standing;
                if(number === 5){
                    if(reaction === "Runner" ){
                    npc.getLogger().Log("jestes chory!");
                    startRunningAway();
                    }else if(reaction === "Caller"){
                    npc.getLogger().Log("Dzwonie na policje!");
                    startRunningAway();
                    }number = 0; 
                }
                if(spoke === true){
                    
                }else if(spoke === false){
                    
                    npc.getLogger().Log("Co ty trzymasz?");
                    spoke = true;
                    npc.wait(5, () => {
                        spoke = false;
                        number++;
                    })
                }
            }else{
                if(type == "Walker"){
                    stan = walkingFromPointToPoint
                }else if(type == "Stander"){
                    stan = Standing;
                }
            }
        }
        function isPlayerSuspicious() {
            if (context.player.pos.dist(npc.pos) < 100 && context.player.frame === 1) {
                isInvestigate = true;
                investigate();
                
            }else{
                isInvestigate = false;
            }
        }
        

        if (isTarget) setTargetForGame(context, npc, outfit)



        npc.onUpdate(() => {
            isPlayerSuspicious();
            /*
               to gowno sentry nie działa, narazie npc widzi przez sciany ale moze
               to sie pozniej naprawi albo gre sie zbuduje pod ta mechanike, *dzwieki*
           */
            const deadBodies = context.map.get("DeadBody") as GameObj<PosComp>[]
            const isNearBody = deadBodies.some(
                (element) => npc.pos.dist(element.pos) < 250
            );


            ifTargetedBounceColor()
            if (stan !== undefined) stan()

            if (isNearBody && !wasNearBody) {
                detectedDeadBody();
            }
            wasNearBody = isNearBody;

            const BloodSplatt = context.map.get("Stain") as GameObj<PosComp>[]
            const BloodNearby = BloodSplatt.filter( // some sprawdza jakie ciala sa
                (element) => npc.pos.dist(element.pos) < 250 && !checkedSplits.has(element)
            );


            const isNearBlood = BloodNearby.length !== 0
            if (isNearBlood && !wasNearBlood) {
                if (stan === runAway) {
                    stan = runAway;
                } else if (stan !== runAway) {
                    goToBlood = game.vec2(BloodNearby[0].pos.x, BloodNearby[0].pos.y);
                    isbloodOrNot = BloodNearby[0].is("Blood");
                    checkedSplits.add(BloodNearby[0])
                    detectedBloodSplit();
                }

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
        //npc.getLogger();
        return npc
    }

    function setOutfitToRandom() {
        outfit = generateOutfit()
    }


    const speedNpc = 200;
    return {
        setPoints,
        isTarget,
        type,
        setType,
        setTarget,
        setOutfitToRandom,
        create,
        setReaction,
        setNpcDialogue
    };
    // dodajemy wampira ktory wyssa kfrew zabbije targeta, bedzie target vampir ktory musi wypic wino z cozsnkiem by umrzec
}
