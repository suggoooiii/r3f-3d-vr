uniform vec2 uDirection;
uniform vec3 uColor;
uniform float progress;
uniform float uBlendFactor;
uniform float uTransparency;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying vec2 vUv;
varying float vElevation;

// Function for transition logic
vec4 transition(vec2 uv) {
    vec2 v = normalize(uDirection);
    v /= abs(v.x) + abs(v.y);
    float d = v.x * 0.5 + v.y * 0.5; // Adjusted to center
    float m = 1.0 - smoothstep(-0.5, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + 0.5)));

    vec4 textureColor1 = texture2D(uTexture1, uv);
    vec4 textureColor2 = texture2D(uTexture2, uv);

    textureColor1.rgb *= vElevation * 1.5 + 0.75;
    textureColor2.rgb *= vElevation * 1.5 + 0.75;

    return mix(textureColor1, textureColor2, m);
}

void main() {
    // Call your transition funcrion
    vec4 finalColor = transition(vUv);

    // Multiply with transparency
    gl_FragColor = finalColor * uTransparency;
}