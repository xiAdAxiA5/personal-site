import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { albums } from '../../data/music';

function Vinyl({ position, rotation, coverUrl }: {
  position: [number, number, number];
  rotation: [number, number, number];
  coverUrl: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMemo(() => new THREE.TextureLoader().load(coverUrl), [coverUrl]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Vinyl disc */}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, -0.11]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>
      {/* Album cover */}
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[1.2, 1.2, 0.05, 64]} />
        <meshStandardMaterial map={texture} roughness={0.4} />
      </mesh>
    </group>
  );
}

function VinylGrid() {
  const cols = 3;
  const spacing = 3.5;

  return (
    <group>
      {albums.map((album, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = (col - (cols - 1) / 2) * spacing;
        const y = -row * spacing;
        return (
          <Vinyl
            key={album.id}
            position={[x, y, 0]}
            rotation={[0.3, 0, 0]}
            coverUrl={album.cover}
          />
        );
      })}
    </group>
  );
}

export default function Music3D() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Music
        </motion.h2>

        <div className="h-[600px] bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark overflow-hidden">
          <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-5, -5, -5]} intensity={0.3} />
            <VinylGrid />
            <OrbitControls
              enableZoom={true}
              autoRotate
              autoRotateSpeed={1}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {albums.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-border-dark"
            >
              <img src={album.cover} alt={album.title} className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <div className="text-sm font-medium dark:text-white">{album.title}</div>
                <div className="text-xs text-gray-400">{album.artist} · {album.genre}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
