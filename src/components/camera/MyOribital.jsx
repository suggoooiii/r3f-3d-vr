import { OrbitControls } from "@react-three/drei";

// this oribital doesnt let you zoom or anything only rotate around the 3d-world
export const MyOribital = () => {
  return (
    <OrbitControls
      autoRotate
      autoRotateSpeed={4}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 2.1}
      maxPolarAngle={Math.PI / 2.1}
    />
  );
};
