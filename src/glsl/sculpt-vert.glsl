#pragma glslify: cnoise4d = require(glsl-noise/classic/4d);
#pragma glslify: snoise4d = require(glsl-noise/simplex/4d);
#pragma glslify: snoise2d = require(glsl-noise/simplex/2d);

uniform int type;
uniform float time;
uniform float speed;
uniform float repeat;
uniform vec3 noise;
uniform float offset;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vN;
varying float vNoise;
varying vec3 vEye;
varying float vColor;

vec3 curl3d(float x,  float   y,  float   z) {
    float   eps = 1., eps2 = 2. * eps;
    float   n1, n2, a,  b;

    vec3    curl = vec3(0.);

    n1  =   snoise2d(vec2( x,    y   +   eps ));
    n2  =   snoise2d(vec2( x,    y   -   eps ));
    a   =   (n1 -   n2)/eps2;

    n1  =   snoise2d(vec2( x,    z   +   eps));
    n2  =   snoise2d(vec2( x,    z   -   eps));
    b   =   (n1 -   n2)/eps2;

    curl.x  =   a   -   b;

    n1  =   snoise2d(vec2( y,    z   +   eps));
    n2  =   snoise2d(vec2( y,    z   -   eps));
    a   =   (n1 -   n2)/eps2;

    n1  =   snoise2d(vec2( x +   eps,    z));
    n2  =   snoise2d(vec2( x +   eps,    z));
    b   =   (n1 -   n2)/eps2;

    curl.y  =   a   -   b;

    n1  =   snoise2d(vec2( x +   eps,    y));
    n2  =   snoise2d(vec2( x -   eps,    y));
    a   =   (n1 -   n2)/eps2;

    n1  =   snoise2d(vec2(  y    +   eps,    z));
    n2  =   snoise2d(vec2(  y    -   eps,    z));
    b   =   (n1 -   n2)/eps2;

    curl.z  =   a   -   b;

    return  curl;
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

    vec3 e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );
    float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    vN = r.xy / m + .5;

    vNormal = normal;
    if(type == 6) {
        vPos = normalize(position);
    } 
    else {
        vPos = position;
    }
    vEye = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;

    vec3 pos = position;
    vColor = 1.0;

    float t = time * .05 * speed * 0.001;
    vec3 c = curl3d(vPos.x*noise.x*repeat + t, vPos.y*noise.y*repeat + t, vPos.z*noise.z*repeat + t);
    vec3 c2 = curl3d(vPos.x*noise.x*repeat + t, -vPos.y*noise.y*repeat + t, vPos.z*noise.z*repeat + t);
    
    if(type == 2) {
        vNoise = cnoise4d(vec4(c, 1));
    }
    else if(type == 3) {
        vNoise = c.y;
    }
    else if(type == 4) {
        vNoise = c2.z;
    }
    else if(type == 5) {
        vNoise = snoise4d(vec4(vPos.x*noise.x*repeat, vPos.y*noise.y*repeat, vPos.z*noise.z*repeat, time*speed*0.0001 + offset));
    }
    else if(type == 6) {
        float repeat = cnoise4d(vec4(time*speed*0.0001,0.0,0.0,0.0)) + 1.0005;
        float noise = cnoise4d(vec4(vPos.x*repeat,vPos.y*repeat,vPos.z*repeat,time*speed*0.0001));
        if(noise > 0.0 && noise < 0.5){
            pos = position + normal * (1.0 - abs(map(noise,0.0,0.5,-1.0,1.0))) * 0.4;
            vColor = (1.0 - abs(map(noise,0.0,0.5,-0.75,0.75)));
        }
        vNoise = noise;
    }
    else {
        vNoise = cnoise4d(vec4(vPos.x*noise.x*repeat, vPos.y*noise.y*repeat, vPos.z*noise.z*repeat, time*speed*0.0001 + offset)); 
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}a