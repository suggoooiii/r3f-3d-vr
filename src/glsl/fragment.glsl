varying vec2 vUv;
uniform float uMultiplier;
uniform float uAlpha;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
uniform float uGamma;
uniform float uFreq1;
uniform vec2 RENDERSIZE;
uniform float uSize;
void main() {
  vec2 mulvUv = mod(vUv * uMultiplier, 2.0);
  float strength = step(0.5, mod(mulvUv.y + uTime, 1.0));
  vec3 mixColor = mix(uColorA, uColorB, step(0.5, mulvUv.x));
  gl_FragColor.rgba = vec4(mixColor, max(strength, uAlpha));
}