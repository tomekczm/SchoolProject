import { Context } from "../main";
import FastNoiseLite from "fastnoise-lite";
export function setupRenderPipeline(context: Context) {

    let lightEnabled = false
    function EnableLight() {
        lightEnabled = true
    }

    function DisableLight() {
        lightEnabled = false
    }

    const { game, player } = context;
    let noise = new FastNoiseLite();
    noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);

    const gameBuffer = game.makeCanvas(game.width(), game.height())
    const uiBuffer = game.makeCanvas(game.width(), game.height())
    game.onDraw(() => {
        /*
        if(lightEnabled) {
            game.drawUVQuad({
            tex: gameBuffer.fb.tex,
            pos: game.vec2(0, 0),
            width: game.width(),
            height: game.height(),
            shader: "Light",
            uniform: {
                "u_pos": game.toScreen(player.pos),
                "u_resolution": game.vec2(game.width(), game.height()),
                "u_radius": 200 * (1 + (noise.GetNoise(game.time()*100, 0)+1)*0.1),
                "u_blur": 10,
            }
        });
        } else {
            game.drawUVQuad({
                tex: gameBuffer.fb.tex,
                pos: game.vec2(0, 0),
                width: game.width(),
                height: game.height(),
            });
        }*/
        game.drawUVQuad({
            tex: gameBuffer.fb.tex,
            pos: game.vec2(0, 0),
            width: game.width(),
            height: game.height(),
        });

        game.drawUVQuad({
            tex: uiBuffer.fb.tex,
            pos: game.vec2(0, 0),
            width: game.width(),
            height: game.height(),
        });

        //gameBuffer.clear()
        //uiBuffer.clear()
    })
    return {EnableLight, DisableLight, gameBuffer, uiBuffer}
}