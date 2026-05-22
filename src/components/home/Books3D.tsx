import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { books } from '../../data/books';

function Book({ position, rotation, coverUrl }: {
  position: [number, number, number];
  rotation: [number, number, number];
  coverUrl: string;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(coverUrl);
  }, [coverUrl]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
      <boxGeometry args={[1.2, 1.8, 0.15]} />
      <meshStandardMaterial attach="material-0" color="#f1f5f9" />
      <meshStandardMaterial attach="material-1" color="#f1f5f9" />
      <meshStandardMaterial attach="material-2" color="#f1f5f9" />
      <meshStandardMaterial attach="material-3" color="#f1f5f9" />
      <meshStandardMaterial attach="material-4" map={texture} />
      <meshStandardMaterial attach="material-5" color="#e2e8f0" />
    </mesh>
  );
}

function BookShelf() {
  const radius = 3;
  const booksPerRow = books.length;

  return (
    <group>
      {books.map((book, i) => {
        const angle = (i / booksPerRow) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Book
            key={book.id}
            index={i}
            position={[x, 0, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
            coverUrl={book.cover}
          />
        );
      })}
    </group>
  );
}

export default function Books3D() {
  return (
    <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          喜欢的书
        </motion.h2>
        <p className="text-center text-gray-400 dark:text-gray-500 mb-12">拖拽旋转查看我的书架</p>

        <div className="h-[500px] bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark overflow-hidden">
          <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            <BookShelf />
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={1.5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
            <fog attach="fog" args={['#f8fafc', 5, 20]} />
          </Canvas>
        </div>

        {/* Book info below */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-sm font-medium dark:text-white">{book.title}</div>
              <div className="text-xs text-gray-400">{book.author}</div>
              <div className="text-yellow-400 text-xs mt-1">{'★'.repeat(book.rating)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
