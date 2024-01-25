/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import "./App.css";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import "./index.css";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { EffectComposer, Bloom, Outline } from "@react-three/postprocessing";
import { easing } from "maath";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  OrbitControls,
  Outlines,
  shaderMaterial,
  useHelper,
} from "@react-three/drei";
import { resolveLygia } from "resolve-lygia";
import { Env2 } from "./components/Scenes";
import niceColors from "nice-color-palettes";

function Boxes() {
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const data = Array.from({ length: 1000 }, () => ({
    color: niceColors[17][Math.floor(Math.random() * 5)],
    scale: 1,
  }));
  const [hovered, set] = useState();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000)
          .fill()
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    [data, tempColor]
  );
  const meshRef = useRef();
  const prevRef = useRef();
  useEffect(() => void (prevRef.current = hovered), [hovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 4);
    meshRef.current.rotation.y = Math.sin(time / 2);
    let i = 0;
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++;
          tempObject.position.set(5 - x, 5 - y, 5 - z);
          tempObject.rotation.y =
            Math.sin(x / 4 + time) +
            Math.sin(y / 4 + time) +
            Math.sin(z / 4 + time);
          tempObject.rotation.z = tempObject.rotation.y * 2;
          if (hovered !== prevRef.Current) {
            (id === hovered
              ? tempColor.setRGB(10, 10, 10)
              : tempColor.set(data[id].color)
            ).toArray(colorArray, id * 3);
            meshRef.current.geometry.attributes.color.needsUpdate = true;
          }
          tempObject.updateMatrix();
          meshRef.current.setMatrixAt(id, tempObject.matrix);
        }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, 1000]}
      onPointerMove={(e) => (e.stopPropagation(), set(e.instanceId))}
      onPointerOut={(e) => set(undefined)}
    >
      <boxGeometry args={[0.6, 0.6, 0.6]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
      </boxGeometry>
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
}

const ColorShiftMaterial = shaderMaterial(
  // uniforms
  {
    u_time: 0.0,
    u_resolution: new THREE.Vector2(30, 200),
    u_color: new THREE.Color(0x000000), // Add this line
  },
  // vertex shader
  resolveLygia(`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `),
  // fragment shader
  resolveLygia(`
  uniform vec2 u_resolution;
  uniform float u_time;
  #include "lygia/generative/snoise.glsl"
  void main(void) {
    vec2 pixel = 1.0 / u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;
    float d2 = snoise(vec2(st * 5. + u_time)) * 2.5 + 0.5;
    float d3 = snoise(vec3(st * 5., u_time)) * 0.5 + 0.5;
    vec3 color = vec3(d2, d3, d2 * d3);
    gl_FragColor = vec4(color, 1.0);
  }
  `)
);
extend({
  MeshLineGeometry,
  MeshLineMaterial,
  ColorShiftMaterial,
});

const Sketch = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  const three = useThree(({ viewport, scene, controls }) => {
    return viewport.getCurrentViewport();
  });
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ meshRef:", meshRef.current);
  }, []);
  useFrame((state, delta) => {
    meshRef.current.material.uniforms.u_time.value += delta * 0.5;

    meshRef.current.material.transparent = true;
    const hue = (state.clock.getElapsedTime() / 10) % 1;
    meshRef.current.material.uniforms.u_color.value.setHSL(hue, 1, 0.5);

    meshRef.current.material.uniforms.u_resolution.value.set(
      three.viewport.width,
      three.viewport.height
    );

    meshRef.current.rotation.x += delta;
  });
  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[5, 5, 3, 3]} wireframe={true} />
      <colorShiftMaterial key={ColorShiftMaterial.key} />
      <Outlines thickness={0.2} color="black" />
    </mesh>
  );
};

function Lightshelper() {
  const light = useRef();
  useHelper(light, THREE.SpotLightHelper, "cyan");
  return (
    <spotLight
      ref={light}
      intensity={7}
      color={"cyan"}
      position={[0.5, 2, -1]}
      shadow-mapSize-width={64}
      shadow-mapSize-height={64}
      castShadow
      shadow-bias={-0.001}
    />
  );
}

function App() {
  // const { dash, count, radius } = useControls({
  //   dash: { value: 0.9, min: 0, max: 0.99, step: 0.01 },
  //   count: { value: 50, min: 0, max: 200, step: 1 },
  //   radius: { value: 50, min: 1, max: 100, step: 1 },
  // });
  const pointLight = useRef();

  return (
    <Canvas
      style={{
        width: "100%",
        height: "100%",
        // backgroundColor: "red",
      }}
    >
      <Sketch />
      <OrbitControls />
      {/* <Experience />  */}
      <ambientLight intensity={3} castShadow color={"orangered"} />
      <pointLight
        ref={pointLight}
        position={[1, 1, 1]}
        intensity={4}
        color={"blue"}
      />
      {/* <Lightshelper /> */}
      <axesHelper args={[5]} />
      <gridHelper />
      {/* <Lines
        dash={1000}
        count={3}
        radius={3}
        colors={[
          [10, 0.5, 2],
          [1, 2, 10],
          "#A2CCB6",
          "#FCEEB5",
          "#EE786E",
          "#e0feff",
        ]}
      /> */}
      {/* <Rig /> */}
      {/* <OrbitControls /> */}
      {/* <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.2} radius={0.5} />
      </EffectComposer> */}
    </Canvas>
  );
}

export default App;
