/* eslint-disable no-unused-vars */
import { useLayoutEffect, useMemo, useRef } from "react";
import { range } from "../../utils";
import { Object3D, Matrix4 } from "three";
import { useFrame } from "@react-three/fiber";
import { Outlines, Trail } from "@react-three/drei";

export const BackgroundScene = ({ count, ...props }) => {
  const mesh = useRef();
  const light = useRef();

  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = range(0, 100);
      const factor = range(20, 120);
      const speed = range(0.01, 0.015) / 2;
      const x = range(-50, 50);
      const y = range(-50, 50);
      const z = range(-50, 50);
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new Object3D(), []);

  useFrame((_state, _delta) => {
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, index) => {
      let { factor, speed, x, y, z } = particle;

      // Update the particle time
      const t = (particle.time += speed);

      // Update the particle position based on the time
      // This is mostly random trigonometry functions to oscillate around the (x, y, z) point
      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );

      // Derive an oscillating value which will be used
      // for the particle size and rotation
      const s = Math.cos(t);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    // mesh.current.needsUpdate = true;
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  useLayoutEffect(() => {
    console.log(
      "🚀 ~ file: BackgroundScene.jsx:66 ~ useLayoutEffect ~ mesh.current.geometry:",
      mesh.current.geometry
    );
  }, []);

  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial />
      <Outlines thickness={0.05} color="hotpink" />
    </mesh>
  );
};
