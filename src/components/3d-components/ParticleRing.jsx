import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { pointsInner, pointsOuter } from "../../utils";
import { OrbitControls, Sphere } from "@react-three/drei";

const ParticleRing = () => {
  <>
    <OrbitControls maxDistance={20} minDistance={10} />
    <directionalLight />
    <pointLight position={[-30, 0, -30]} power={10.0} />
    <PointCircle />

    <h1 className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-slate-200 font-medium text-2xl md:text-5xl pointer-events-none">
      Drag & Zoom
    </h1>
  </>;
};

export const PointCircle = () => {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (ref.current?.rotation) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {pointsInner.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
      {pointsOuter.map((point) => (
        <Point key={point.idx} position={point.position} color={point.color} />
      ))}
    </group>
  );
};

const Point = ({ position, color }) => {
  return (
    <Sphere position={position} args={[0.1, 10, 10]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        color={color}
      />
    </Sphere>
  );
};

export default ParticleRing;
