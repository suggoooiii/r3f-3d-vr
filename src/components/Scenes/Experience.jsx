import {
  ContactShadows,
  Environment,
  Lightformer,
  Sky,
  useFBO,
  useTexture,
} from "@react-three/drei";
import { useTransition, useState, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { v4 as uuidv4 } from "uuid";
import { resolveLygia } from "resolve-lygia";
import { useFrame } from "@react-three/fiber";

export function Experience() {
  const [preset, setPreset] = useState("sunset");
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  const [inTransition, startTransition] = useTransition();
  console.log("🚀 ~ Experience ~ inTransition:", inTransition);
  const { blur } = useControls({
    blur: { value: 0.65, min: 0, max: 1 },
    preset: {
      value: preset,
      options: [
        "sunset",
        "dawn",
        "night",
        "warehouse",
        "forest",
        "apartment",
        "studio",
        "city",
        "park",
        "lobby",
      ],
      // If onChange is present the value will not be reactive, see https://github.com/pmndrs/leva/blob/main/docs/advanced/controlled-inputs.md#onchange
      // Instead we transition the preset value, which will prevents the suspense bound from triggering its fallback
      // That way we can hang onto the current environment until the new one has finished loading ...
      onChange: (value) => startTransition(() => setPreset(value)),
    },
  });
  return <Environment preset={preset} background blur={blur} />;
}

export const Env = () => {
  const texture = useTexture("../../public/assets/dux_male.jpg");
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return (
    <Environment resolution={1920} background>
      <ambientLight intensity={2} />
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[2]} />
        <meshStandardMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <Lightformer
        position={[-3, 1, -3]}
        form="circle"
        color="orange"
        intensity={5}
        scale={0.1}
      />
    </Environment>
  );
};

export function Lens() {
  const mesh1 = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();
  const mesh4 = useRef();
  const lens = useRef();
  const renderTarget = useFBO();

  useFrame((state) => {
    const { gl, clock, scene, camera, pointer } = state;

    console.log(uniforms.winResolution.value);
    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 0]);

    lens.current.position.x = THREE.MathUtils.lerp(
      lens.current.position.x,
      (pointer.x * viewport.width) / 2,
      0.1
    );
    lens.current.position.y = THREE.MathUtils.lerp(
      lens.current.position.y,
      (pointer.y * viewport.height) / 2,
      0.1
    );

    const oldMaterialMesh3 = mesh3.current.material;
    const oldMaterialMesh4 = mesh4.current.material;

    mesh1.current.visible = false;
    mesh2.current.visible = true;

    mesh3.current.material = new THREE.MeshBasicMaterial();
    mesh3.current.material.color = new THREE.Color("#000000");
    mesh3.current.material.wireframe = true;

    mesh4.current.material = new THREE.MeshBasicMaterial();
    mesh4.current.material.color = new THREE.Color("#000000");
    mesh4.current.material.wireframe = true;

    gl.setRenderTarget(renderTarget);
    gl.render(scene, camera);

    lens.current.material.uniforms.uTexture.value = renderTarget.texture;
    lens.current.material.uniforms.winResolution.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ).multiplyScalar(Math.min(window.devicePixelRatio, 2));

    mesh1.current.visible = true;
    mesh2.current.visible = false;

    mesh3.current.material = oldMaterialMesh3;
    mesh3.current.material.wireframe = false;

    mesh4.current.material = oldMaterialMesh4;
    mesh4.current.material.wireframe = false;

    mesh1.current.rotation.x = Math.cos(clock.elapsedTime / 2);
    mesh1.current.rotation.y = Math.sin(clock.elapsedTime / 2);
    mesh1.current.rotation.z = Math.sin(clock.elapsedTime / 2);

    mesh2.current.rotation.x = Math.cos(clock.elapsedTime / 2);
    mesh2.current.rotation.y = Math.sin(clock.elapsedTime / 2);
    mesh2.current.rotation.z = Math.sin(clock.elapsedTime / 2);

    gl.setRenderTarget(null);
  });

  const uniforms =
    (() => ({
      uTexture: {
        value: null,
      },
      winResolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
      },
    }),
    []);

  return (
    <>
      <Sky sunPosition={[10, 10, 0]} />
      <Environment preset="sunset" />
      <directionalLight args={[10, 10, 0]} intensity={1} />
      <ambientLight intensity={0.5} />
      <ContactShadows
        frames={1}
        scale={10}
        position={[0, -2, 0]}
        blur={4}
        opacity={0.2}
      />
      <mesh ref={lens} scale={0.5} position={[0, 0, 2.5]}>
        <sphereGeometry args={[1, 128]} />
        <shaderMaterial
          key={uuidv4()}
          fragmentShader={resolveLygia(`
          uniform vec2 winResolution;
          uniform sampler2D uTexture;

          vec4 fromLinear(vec4 linearRGB){
            bvec3 cutoff=lessThan(linearRGB.rgb,vec3(.0031308));
            vec3 higher=vec3(1.055)*pow(linearRGB.rgb,vec3(1./2.4))-vec3(.055);
            vec3 lower=linearRGB.rgb*vec3(12.92);
  
            return vec4(mix(higher,lower,cutoff),linearRGB.a);
            }
            void main(){
              vec2 uv=gl_FragCoord.xy/winResolution.xy;
              vec4 color=fromLinear(texture2D(uTexture,uv));
              gl_FragColor=color;
            }
            `)}
          vertexShader={resolveLygia(`
          uniform vec2 winResolution;
          uniform sampler2D uTexture;
          vec4 fromLinear(vec4 linearRGB) {
            bvec3 cutoff = lessThan(linearRGB.rgb, vec3(0.0031308));
            vec3 higher = vec3(1.055)*pow(linearRGB.rgb, vec3(1.0/2.4)) - vec3(0.055);
            vec3 lower = linearRGB.rgb * vec3(12.92
            return vec4(mix(higher, lower, cutoff), linearRGB.a);
          }
          void main() {
            vec2 uv = gl_FragCoord.xy / winResolution.xy;
            vec4 color = fromLinear(texture2D(uTexture, uv));
            gl_FragColor = color;
          }`)}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
      <group>
        <mesh ref={mesh2}>
          <torusGeometry args={[1, 0.25, 16, 100]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh1}>
          <dodecahedronGeometry args={[1]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh3} position={[-3, 1, -2]}>
          <icosahedronGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh4} position={[3, -1, -2]}>
          <icosahedronGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
      </group>
    </>
  );
}
export const Env2 = () => (
  <Environment
    background={true}
    files={
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/studio-small-3/studio_small_03_1k.hdr"
    }
  />
);
