import {useRef, useMemo} from'react';
import {Canvas, useFrame} from'@react-three/fiber';
import {OrbitControls, Sphere, MeshDistortMaterial, Float, Environment, MeshWobbleMaterial} from'@react-three/drei';
import * as THREE from'three';

interface Baby3DProps {
 week: number;
}

// Embrião (semanas 4-9)
const Embryo = ({week}: {week: number}) => {
 const groupRef = useRef<THREE.Group>(null);
 const scale = 0.4 + (week - 4) * 0.08;
 
 useFrame((state) => {
 if (groupRef.current) {
 groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
 groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
}
});

 return (
 <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
 <group ref={groupRef}>
 {/* Corpo principal do embrião */}
 <Sphere args={[scale, 32, 32]}>
 <MeshDistortMaterial
 color="#ffb4c2"attach="material"distort={0.4}
 speed={3}
 roughness={0.3}
 metalness={0.1}
 />
 </Sphere>
 {/* Cabeça começando a se formar */}
 <Sphere args={[scale * 0.6, 24, 24]} position={[0, scale * 0.8, 0]}>
 <MeshDistortMaterial
 color="#ffc4d0"distort={0.3}
 speed={2}
 roughness={0.3}
 />
 </Sphere>
 </group>
 </Float>
);
};

// Feto inicial (semanas 10-19)
const EarlyFetus = ({week}: {week: number}) => {
 const groupRef = useRef<THREE.Group>(null);
 const bodyScale = 0.35 + (week - 10) * 0.04;
 const headScale = bodyScale * 1.1;
 
 useFrame((state) => {
 if (groupRef.current) {
 groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
 groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
}
});

 return (
 <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
 <group ref={groupRef}>
 {/* Cabeça */}
 <Sphere args={[headScale, 32, 32]} position={[0, bodyScale * 1.3, 0]}>
 <MeshDistortMaterial
 color="#ffccd5"distort={0.15}
 speed={2}
 roughness={0.4}
 metalness={0.05}
 />
 </Sphere>
 
 {/* Olhos fechados */}
 <mesh position={[-headScale * 0.3, bodyScale * 1.4, headScale * 0.7]}>
 <sphereGeometry args={[headScale * 0.12, 16, 16]} />
 <meshStandardMaterial color="#e8a0b0"/>
 </mesh>
 <mesh position={[headScale * 0.3, bodyScale * 1.4, headScale * 0.7]}>
 <sphereGeometry args={[headScale * 0.12, 16, 16]} />
 <meshStandardMaterial color="#e8a0b0"/>
 </mesh>
 
 {/* Corpo */}
 <mesh position={[0, 0, 0]}>
 <capsuleGeometry args={[bodyScale * 0.6, bodyScale * 0.8, 16, 32]} />
 <MeshDistortMaterial
 color="#ffccd5"distort={0.1}
 speed={1.5}
 roughness={0.4}
 />
 </mesh>
 
 {/* Braços */}
 <mesh position={[-bodyScale * 1.1, bodyScale * 0.4, 0]} rotation={[0, 0, 0.5]}>
 <capsuleGeometry args={[bodyScale * 0.15, bodyScale * 0.5, 8, 16]} />
 <meshStandardMaterial color="#ffd4dc"roughness={0.5} />
 </mesh>
 <mesh position={[bodyScale * 1.1, bodyScale * 0.4, 0]} rotation={[0, 0, -0.5]}>
 <capsuleGeometry args={[bodyScale * 0.15, bodyScale * 0.5, 8, 16]} />
 <meshStandardMaterial color="#ffd4dc"roughness={0.5} />
 </mesh>
 
 {/* Pernas */}
 <mesh position={[-bodyScale * 0.4, -bodyScale * 0.9, 0]} rotation={[0.3, 0, 0.2]}>
 <capsuleGeometry args={[bodyScale * 0.18, bodyScale * 0.55, 8, 16]} />
 <meshStandardMaterial color="#ffd4dc"roughness={0.5} />
 </mesh>
 <mesh position={[bodyScale * 0.4, -bodyScale * 0.9, 0]} rotation={[0.3, 0, -0.2]}>
 <capsuleGeometry args={[bodyScale * 0.18, bodyScale * 0.55, 8, 16]} />
 <meshStandardMaterial color="#ffd4dc"roughness={0.5} />
 </mesh>
 </group>
 </Float>
);
};

// Bebê desenvolvido (semanas 20+)
const DevelopedBaby = ({week}: {week: number}) => {
 const groupRef = useRef<THREE.Group>(null);
 const bodyScale = 0.45 + (week - 20) * 0.012;
 const headScale = bodyScale * 0.85;
 
 useFrame((state) => {
 if (groupRef.current) {
 groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
 groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
}
});

 return (
 <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
 <group ref={groupRef}>
 {/* Cabeça */}
 <Sphere args={[headScale, 32, 32]} position={[0, bodyScale * 1.6, 0]}>
 <MeshWobbleMaterial
 color="#ffe0e6"factor={0.1}
 speed={1}
 roughness={0.4}
 />
 </Sphere>
 
 {/* Olhos fechados */}
 <mesh position={[-headScale * 0.35, bodyScale * 1.65, headScale * 0.75]}>
 <sphereGeometry args={[headScale * 0.1, 16, 16]} />
 <meshStandardMaterial color="#dda0b0"/>
 </mesh>
 <mesh position={[headScale * 0.35, bodyScale * 1.65, headScale * 0.75]}>
 <sphereGeometry args={[headScale * 0.1, 16, 16]} />
 <meshStandardMaterial color="#dda0b0"/>
 </mesh>
 
 {/* Nariz */}
 <mesh position={[0, bodyScale * 1.5, headScale * 0.85]}>
 <sphereGeometry args={[headScale * 0.08, 12, 12]} />
 <meshStandardMaterial color="#ffd0d8"/>
 </mesh>
 
 {/* Boca */}
 <mesh position={[0, bodyScale * 1.35, headScale * 0.8]}>
 <torusGeometry args={[headScale * 0.12, headScale * 0.03, 8, 16, Math.PI]} />
 <meshStandardMaterial color="#e8a0b0"/>
 </mesh>
 
 {/* Orelhas */}
 <mesh position={[-headScale * 0.9, bodyScale * 1.6, 0]}>
 <sphereGeometry args={[headScale * 0.15, 12, 12]} />
 <meshStandardMaterial color="#ffd4dc"/>
 </mesh>
 <mesh position={[headScale * 0.9, bodyScale * 1.6, 0]}>
 <sphereGeometry args={[headScale * 0.15, 12, 12]} />
 <meshStandardMaterial color="#ffd4dc"/>
 </mesh>
 
 {/* Corpo */}
 <mesh position={[0, 0, 0]}>
 <capsuleGeometry args={[bodyScale * 0.7, bodyScale * 1.4, 16, 32]} />
 <MeshWobbleMaterial
 color="#ffe0e6"factor={0.05}
 speed={1}
 roughness={0.4}
 />
 </mesh>
 
 {/* Barriga */}
 <Sphere args={[bodyScale * 0.55, 24, 24]} position={[0, -bodyScale * 0.1, bodyScale * 0.3]}>
 <meshStandardMaterial color="#ffe8ec"roughness={0.5} />
 </Sphere>
 
 {/* Braços dobrados */}
 <mesh position={[-bodyScale * 1.2, bodyScale * 0.5, bodyScale * 0.4]} rotation={[0.8, 0, 0.6]}>
 <capsuleGeometry args={[bodyScale * 0.18, bodyScale * 0.7, 8, 16]} />
 <meshStandardMaterial color="#ffe4ea"roughness={0.5} />
 </mesh>
 <mesh position={[bodyScale * 1.2, bodyScale * 0.5, bodyScale * 0.4]} rotation={[0.8, 0, -0.6]}>
 <capsuleGeometry args={[bodyScale * 0.18, bodyScale * 0.7, 8, 16]} />
 <meshStandardMaterial color="#ffe4ea"roughness={0.5} />
 </mesh>
 
 {/* Mãos */}
 <Sphere args={[bodyScale * 0.12, 12, 12]} position={[-bodyScale * 0.8, bodyScale * 0.9, bodyScale * 0.7]}>
 <meshStandardMaterial color="#ffd8e0"/>
 </Sphere>
 <Sphere args={[bodyScale * 0.12, 12, 12]} position={[bodyScale * 0.8, bodyScale * 0.9, bodyScale * 0.7]}>
 <meshStandardMaterial color="#ffd8e0"/>
 </Sphere>
 
 {/* Pernas dobradas */}
 <mesh position={[-bodyScale * 0.5, -bodyScale * 1.3, bodyScale * 0.5]} rotation={[1.3, 0, 0.4]}>
 <capsuleGeometry args={[bodyScale * 0.22, bodyScale * 0.9, 8, 16]} />
 <meshStandardMaterial color="#ffe4ea"roughness={0.5} />
 </mesh>
 <mesh position={[bodyScale * 0.5, -bodyScale * 1.3, bodyScale * 0.5]} rotation={[1.3, 0, -0.4]}>
 <capsuleGeometry args={[bodyScale * 0.22, bodyScale * 0.9, 8, 16]} />
 <meshStandardMaterial color="#ffe4ea"roughness={0.5} />
 </mesh>
 
 {/* Pés */}
 <Sphere args={[bodyScale * 0.14, 12, 12]} position={[-bodyScale * 0.3, -bodyScale * 1.8, bodyScale * 0.9]}>
 <meshStandardMaterial color="#ffd8e0"/>
 </Sphere>
 <Sphere args={[bodyScale * 0.14, 12, 12]} position={[bodyScale * 0.3, -bodyScale * 1.8, bodyScale * 0.9]}>
 <meshStandardMaterial color="#ffd8e0"/>
 </Sphere>
 
 {/* Cordão umbilical */}
 <mesh position={[0, -bodyScale * 0.4, bodyScale * 0.9]}>
 <torusGeometry args={[bodyScale * 0.35, bodyScale * 0.08, 8, 32, Math.PI * 1.5]} />
 <meshStandardMaterial color="#e879a9"roughness={0.6} />
 </mesh>
 </group>
 </Float>
);
};

// Saco amniótico com efeito brilhante
const AmnioticSac = ({week}: {week: number}) => {
 const meshRef = useRef<THREE.Mesh>(null);
 const scale = 1.8 + (week / 40) * 0.6;
 
 useFrame((state) => {
 if (meshRef.current) {
 const material = meshRef.current.material as THREE.MeshStandardMaterial;
 material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
}
});

 return (
 <Sphere ref={meshRef} args={[scale, 64, 64]}>
 <meshStandardMaterial
 color="#ff2d8a"transparent
 opacity={0.15}
 roughness={0.1}
 metalness={0.4}
 side={THREE.BackSide}
 />
 </Sphere>
);
};

// Parede do útero com gradiente
const UterusWall = () => {
 const meshRef = useRef<THREE.Mesh>(null);
 
 useFrame((state) => {
 if (meshRef.current) {
 const material = meshRef.current.material as THREE.MeshStandardMaterial;
 material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
}
});

 return (
 <Sphere ref={meshRef} args={[2.8, 64, 64]}>
 <meshStandardMaterial
 color="#ff2d8a"transparent
 opacity={0.25}
 roughness={0.2}
 metalness={0.3}
 side={THREE.BackSide}
 />
 </Sphere>
);
};

// Partículas flutuantes no líquido amniótico
const Particles = () => {
 const particlesRef = useRef<THREE.Points>(null);
 
 const particles = useMemo(() => {
 const positions = new Float32Array(150 * 3);
 for (let i = 0; i < 150; i++) {
 const theta = Math.random() * Math.PI * 2;
 const phi = Math.acos(2 * Math.random() - 1);
 const r = 0.8 + Math.random() * 1.5;
 positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
 positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
 positions[i * 3 + 2] = r * Math.cos(phi);
}
 return positions;
}, []);
 
 useFrame((state) => {
 if (particlesRef.current) {
 particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
 particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
}
});

 return (
 <points ref={particlesRef}>
 <bufferGeometry>
 <bufferAttribute
 attach="attributes-position"count={150}
 array={particles}
 itemSize={3}
 />
 </bufferGeometry>
 <pointsMaterial
 size={0.04}
 color="#ffd6e7"transparent
 opacity={0.7}
 sizeAttenuation
 />
 </points>
);
};

// Cena principal
const Scene = ({week}: {week: number}) => {
 return (
 <>
 {/* Iluminação */}
 <ambientLight intensity={0.6} color="#ffffff"/>
 <pointLight position={[10, 10, 10]} intensity={1.2} color="#ff2d8a"/>
 <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff2d8a"/>
 <pointLight position={[0, 10, 0]} intensity={0.6} color="#ff7cb3"/>
 <spotLight
 position={[0, 5, 8]}
 angle={0.6}
 penumbra={1}
 intensity={1.5}
 color="#ffffff"castShadow
 />
 
 {/* Elementos da cena */}
 <UterusWall />
 <AmnioticSac week={week} />
 <Particles />
 
 {/* Bebê baseado na semana */}
 {week < 10? (
 <Embryo week={week} />
): week < 20? (
 <EarlyFetus week={week} />
): (
 <DevelopedBaby week={week} />
)}
 
 {/* Controles */}
 <OrbitControls
 enableZoom={true}
 enablePan={false}
 minDistance={2.5}
 maxDistance={5}
 autoRotate
 autoRotateSpeed={0.8}
 />
 <Environment preset="sunset"/>
 </>
);
};

export const Baby3D = ({week}: Baby3DProps) => {
 return (
 <div 
 className="relative w-full h-80 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl"style={{
 background:'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--primary)/0.15) 30%, hsl(var(--primary)/0.25) 60%, #140008 100%)',
 boxShadow:'0 25px 50px -12px rgba(168, 85, 247, 0.4), inset 0 0 80px rgba(236, 72, 153, 0.1)'}}
 >
 <Canvas
 camera={{position: [0, 0, 4], fov: 50}}
 gl={{alpha: false, antialias: true}}
 dpr={[1, 2]}
 >
 <color attach="background"args={['#080008']} />
 <fog attach="fog"args={['#080008', 5, 15]} />
 <Scene week={week} />
 </Canvas>
 
 {/* Overlay com gradiente */}
 <div 
 className="absolute inset-0 pointer-events-none rounded-2xl"style={{
 background:'radial-gradient(circle at 50% 50%, transparent 40%, rgba(88, 28, 135, 0.3) 100%)'}}
 />
 
 {/* Brilho nas bordas */}
 <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-primary/30"/>
 
 {/* Indicador de semana */}
 <div 
 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground px-6 py-2 rounded-full text-sm font-bold"style={{
 background:'linear-gradient(90deg, #ff2d8a 0%, #ff7cb3 100%)',
 boxShadow:'0 10px 30px -5px rgba(168, 85, 247, 0.5)'}}
 >
 {week} semanas 
 </div>
 
 {/* Dica de interação */}
 <div className="absolute top-3 right-3 text-foreground/70 text-xs bg-secondary/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
 Toque para girar
 </div>
 
 {/* Decoração */}
 <div className="absolute top-3 left-3 text-foreground/70 text-xs bg-primary/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
 Bebê 3D
 </div>
 </div>
);
};

export default Baby3D;
