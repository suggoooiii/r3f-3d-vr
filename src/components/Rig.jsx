import { CameraShake } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useState } from "react";
import * as THREE from "three";

export function Rig({ radius = 20 }) {
  useFrame((state, dt) => {
    easing.damp3(
      state.camera.position,
      [
        Math.sin(state.pointer.x) * radius,
        Math.atan(state.pointer.y) * radius,
        Math.cos(state.pointer.x) * radius,
      ],
      0.25,
      dt
    );
    state.camera.lookAt(0, 0, 0);
  });
}

export function Rig2() {
  const [vec] = useState(() => new THREE.Vector3());
  const { camera, pointer } = useThree();
  useFrame(() => camera.position.lerp(vec.set(pointer.x * 2, 1, 60), 0.05));
  return (
    <CameraShake
      maxYaw={0.01}
      maxPitch={0.01}
      maxRoll={0.01}
      yawFrequency={0.5}
      pitchFrequency={0.5}
      rollFrequency={0.4}
    />
  );
}

export function CameraRig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.lerp(v.set(Math.sin(t / 5), 0, 12 + Math.cos(t / 5) / 2), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}