// dodanie prostych hitboxów itp
import { KAPLAYCtx } from "kaplay";

export function testMap(game: KAPLAYCtx) {
    game.add([game.pos(0, 0), game.rect(game.width(), game.height()), game.color(255, 255, 255), game.fixed(), "Background"]);

    const barriers = [
        {"x": 0, "y": 0, "width": 900, "height": 30},
         {"x": 0, "y": 0, "width": 30, "height": 700},
          {"x": 0, "y": 700, "width": 930, "height": 30},
           {"x": 900, "y": 0, "width": 30, "height": 700},
            {"x": 450, "y": 0, "width": 30, "height": 600},
             {"x": 450, "y": 300, "width": 300, "height": 30},
              {"x": 150, "y": 300, "width": 300, "height": 30}];

    barriers.forEach((barrier) => {
        game.add([game.pos(barrier.x, barrier.y), game.rect(barrier.width, barrier.height), game.color(0,0,0), game.area(), "Wall"]);
    });
}