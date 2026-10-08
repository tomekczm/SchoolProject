uniform float u_enabled;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec4 tcolor = texture2D(tex, uv);
    // these weights cuz its the luminoscity method?
    // https://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
    if (u_enabled == 0.0) {
        float grayscaleClr = 
            0.21 * tcolor.r + 
            0.72 * tcolor.g + 
            0.07 * tcolor.b;

        return vec4(
            grayscaleClr,
            grayscaleClr,
            grayscaleClr,
            tcolor.a
        );
    } else {
        return tcolor;
    }
}