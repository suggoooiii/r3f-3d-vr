import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

export function Lines({
  dash,
  count,
  colors,
  radius = 50,
  rand = THREE.MathUtils.randFloatSpread,
}) {
  const lines = useMemo(() => {
    return Array.from({ length: count }, () => {
      const pos = new THREE.Vector3(rand(radius), rand(radius), rand(radius));
      const points = Array.from({ length: 10 }, () =>
        pos
          .add(new THREE.Vector3(rand(radius), rand(radius), rand(radius)))
          .clone()
      );
      const curve = new THREE.CatmullRomCurve3(points).getPoints(300);
      return {
        color: colors[parseInt(colors.length * Math.random())],
        width: Math.max(radius / 100, (radius / 50) * Math.random()),
        speed: Math.max(0.1, 1 * Math.random()),
        curve: curve.flatMap((point) => point.toArray()),
      };
    });
  }, [colors, count, radius, rand]);
  return lines.map((props, index) => (
    <Fatline key={index} dash={dash} {...props} />
  ));
}
function Fatline({ curve, width, color, speed, dash }) {
  const ref = useRef();
  useFrame(
    (state, delta) => (ref.current.material.dashOffset -= (delta * speed) / 10)
  );
  return (
    <mesh ref={ref}>
      <MeshLineGeometry points={curve} />
      <MeshLineMaterial
        transparent
        lineWidth={width}
        color={color}
        depthWrite={false}
        dashArray={0.25}
        dashRatio={dash}
        toneMapped={true}
      />
    </mesh>
  );
}
