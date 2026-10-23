uniform vec2 u_pos;
uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_blur;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec2 pixelPos = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    
    float dist = distance(pixelPos, u_pos);
    
    float alpha = smoothstep(max((dist - u_radius) / u_blur, 0.0), 0.0, 1.0);
    return mix(vec4(0, 0, 0, 1), def_frag(), 1.0 - alpha);
}