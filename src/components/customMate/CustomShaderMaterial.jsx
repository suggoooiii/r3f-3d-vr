import { shaderMaterial } from "@react-three/drei";
// import {extend} from "@react-three/fiber";
import stripesVertex from "../../glsl/vertex.glsl";
import stripesFragment from "../../glsl/fragment.glsl";
import * as THREE from "three";
import { resolveLygia } from "resolve-lygia";

const vertex = resolveLygia(stripesVertex);
const fragment = resolveLygia(stripesFragment);
console.log("🚀 ~ fragment,vertex", fragment, vertex);
const CustomShaderMaterial = shaderMaterial(
  {
    // Uniform
    uAlpha: 0.5,
    uMultiplier: 42,
    uColorA: new THREE.Color(),
    uColorB: new THREE.Color(),
    uTime: 0,
    RENDERSIZE: new THREE.Vector2(window.innerWidth, window.innerHeight),
    uGamma: 0.7,
    uFreq1: 0.5,
    uSize: 8.95,
  },
  // Vertex Shader
  vertex,
  // Fragment Shader
  fragment
);

export default CustomShaderMaterial;
