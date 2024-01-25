precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vNormal = position * normal;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
