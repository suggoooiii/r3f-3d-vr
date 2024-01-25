uniform int type;
uniform float time;
uniform float repeat;
uniform float fill;
uniform float offset;
uniform float step;
uniform bool edge;
uniform sampler2D matcapTex;
uniform sampler2D matcap2Tex;
uniform samplerCube envMap;
uniform float opacity;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vN;
varying vec3 vEye;
varying float vNoise;
varying float vColor;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
  return reflected.xy / m + 0.5;
}

void main() {

  float n = vNoise;
  float a = 0.0;
  float t = offset * fill;
  if(n < t && type != 6) {
    discard;
  }

  vec2 matcapUV = matcap(vEye, vNormal).xy;
  vec3 c = texture2D(matcapTex, vN).rgb;
  vec3 baseMat = vec3(offset * c.r, offset * c.g, offset * c.b);
  vec3 c2 = texture2D(matcap2Tex, vN).rgb;
  vec3 baseMat2 = vec3(offset * c2.r, offset * c2.g, offset * c2.b);
  vec3 base = vec3(0, 0, 0);

  if(type == 0 || type == 3 || type == 5) {
    const int steps = 24;
    for(int i = 0; i < steps; i++) {
      float j = float(i);
      float start = t + j * step;
      float end = t + (j + 0.75) * step;
      if(n > start && n < end) {
        base = edge && (i == 0 || i == steps - 1) ? baseMat2 : baseMat;
        a = opacity;
      }
    }
  } else if(type == 4) {
    float u = t + 15.0 * step;
    if(n > t && n < u) {
      base = edge ? baseMat2 : baseMat;
      a = opacity;
      if(edge && n > t + step && n < u - step) {
        base = baseMat;
      }
    }
  } else if(type == 6) {
    vec3 c = vec3(abs(vPos.x), abs(vPos.y), abs(vPos.z));
    float u = 0.5;
    if(n > t && n < u) {
      base = c;
      if(n > t + step && n < u - step) {
        base *= vColor;
      }
    }
    a = opacity;
  } else {
    if(n > t) {
      base = edge ? baseMat2 : baseMat;
      a = opacity;
    }
    if(edge && n > t + step) {
      base = baseMat;
    }
  }

  gl_FragColor = vec4(base, a);

}