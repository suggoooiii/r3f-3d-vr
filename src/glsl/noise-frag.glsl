#pragma glslify: cnoise3d = require(glsl-noise/classic/3d);

uniform vec2 resolution;
uniform float time;
uniform vec3 color;

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;

    vec3 pos = vec3(st * 1.6, time * 0.0002);

    float n = cnoise3d(pos);
    if(n < 0.0) {
    	discard;
    }

    gl_FragColor = vec4(color, 1.0);
}