/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
export function Model2(props) {
  const groupRef = useRef();
  const meshRef = useRef();
  useEffect(() => {
    console.log(materials);
    console.log("🚀 ~ useEffect ~ nodes.geometry_0:", nodes.geometry_0);
  }, [materials, nodes.geometry_0]);

  useFrame((state, delta) => {
    // groupRef.current.rotation.y += delta;
    // groupRef.current.rotation.x += 0.005;
    // groupRef.current.rotation.z += delta;
  }, []);

  const { nodes, materials } = useGLTF(
    "/cfbcfb01a9f4_A_detailed_robot_head.glb"
  );
  console.log("🚀 ~ Model2 ~ nodes:", nodes, materials);
  return (
    <group {...props} dispose={null} ref={groupRef}>
      <mesh
        name="geometry_0"
        castShadow
        receiveShadow
        geometry={nodes.geometry_0.geometry}
        material={materials.Material_0}
        // ref={meshRef}
      />
    </group>
  );
}

useGLTF.preload("/cfbcfb01a9f4_A_detailed_robot_head.glb");
