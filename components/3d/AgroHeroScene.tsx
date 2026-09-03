"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function AgroHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Initialiser le renderer WebGL natif Three.js
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 2. Scène & Caméra
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 5.8);

    // 3. Éclairage Studio Chaleureux & Agro-Industriel
    const ambientLight = new THREE.AmbientLight(0xfbf9f5, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfef4d5, 2.2);
    dirLight1.position.set(6, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc26526, 1.2);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xe6af2e, 1.8, 12);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Groupe principal pour les rotations et la parallaxe
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4. Matériaux Nobles
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E6AF2E"),
      metalness: 0.8,
      roughness: 0.25,
      emissive: new THREE.Color("#7F520B"),
      emissiveIntensity: 0.3,
    });

    const stalkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C2783E"),
      metalness: 0.4,
      roughness: 0.5,
    });

    const siloMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2A3A2C"),
      metalness: 0.85,
      roughness: 0.35,
    });

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#E6AF2E"),
      wireframe: true,
    });

    // 5. Construction de l'Épi de Blé Stylisé
    function createWheatEar(scale = 1): THREE.Group {
      const earGroup = new THREE.Group();

      // Tige
      const stalkGeom = new THREE.CylinderGeometry(0.035, 0.045, 3.4, 16);
      const stalkMesh = new THREE.Mesh(stalkGeom, stalkMaterial);
      stalkMesh.position.y = -0.2;
      earGroup.add(stalkMesh);

      // Grains étagés
      const grainGeom = new THREE.SphereGeometry(1, 16, 16);
      const grainLevels = 7;
      for (let i = 0; i < grainLevels; i++) {
        const y = -1.1 + i * 0.42;
        const angle = i * 0.4;

        // Grain gauche
        const leftGrain = new THREE.Mesh(grainGeom, goldMaterial);
        leftGrain.position.set(-0.22, y, 0);
        leftGrain.rotation.set(0, 0, 0.45 + angle * 0.1);
        leftGrain.scale.set(0.18, 0.38, 0.14);
        earGroup.add(leftGrain);

        // Grain droit
        const rightGrain = new THREE.Mesh(grainGeom, goldMaterial);
        rightGrain.position.set(0.22, y, 0);
        rightGrain.rotation.set(0, 0, -0.45 - angle * 0.1);
        rightGrain.scale.set(0.18, 0.38, 0.14);
        earGroup.add(rightGrain);
      }

      // Grain terminal au sommet
      const topGrain = new THREE.Mesh(grainGeom, goldMaterial);
      topGrain.position.set(0, 1.85, 0);
      topGrain.scale.set(0.16, 0.45, 0.14);
      earGroup.add(topGrain);

      earGroup.scale.set(scale, scale, scale);
      return earGroup;
    }

    const primaryWheat = createWheatEar(1.15);
    primaryWheat.position.set(-0.9, 0, 0.4);
    mainGroup.add(primaryWheat);

    const backgroundWheat = createWheatEar(0.7);
    backgroundWheat.position.set(2.2, 0.6, -2.4);
    mainGroup.add(backgroundWheat);

    // 6. Construction du Silo Industriel
    const siloGroup = new THREE.Group();
    const siloBodyGeom = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 32);
    const siloBody = new THREE.Mesh(siloBodyGeom, siloMaterial);
    siloGroup.add(siloBody);

    [-1.2, -0.4, 0.4, 1.2].forEach((y) => {
      const ringGeom = new THREE.TorusGeometry(1.24, 0.03, 8, 32);
      const ring = new THREE.Mesh(ringGeom, ringMaterial);
      ring.position.y = y;
      siloGroup.add(ring);
    });

    const topDomeGeom = new THREE.ConeGeometry(1.22, 1.0, 32);
    const topDome = new THREE.Mesh(topDomeGeom, siloMaterial);
    topDome.position.y = 2.1;
    siloGroup.add(topDome);

    const bottomConeGeom = new THREE.ConeGeometry(1.2, 0.8, 32);
    const bottomCone = new THREE.Mesh(bottomConeGeom, siloMaterial);
    bottomCone.position.y = -2.0;
    bottomCone.rotation.x = Math.PI;
    siloGroup.add(bottomCone);

    siloGroup.position.set(1.4, -0.2, -1.2);
    siloGroup.scale.set(0.88, 0.88, 0.88);
    mainGroup.add(siloGroup);

    // 7. Nuage de Particules de Pollen Doré
    const particleCount = 100;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.07,
      color: new THREE.Color("#F5C95C"),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 8. Gestion de la Parallaxe Souris et du Scroll
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 9. Boucle d'animation fluide
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const scrollY = window.scrollY || 0;

      // Parallaxe amortie
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Oscillations harmoniques des épis
      primaryWheat.rotation.y = elapsedTime * 0.35;
      primaryWheat.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      backgroundWheat.rotation.y = elapsedTime * 0.2;

      // Rotation douce du silo
      siloGroup.rotation.y = -elapsedTime * 0.12;

      // Particules flottantes
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;

      // Contrôle de caméra / groupe via scroll et souris
      mainGroup.rotation.y = mouseX + scrollY * 0.0016;
      mainGroup.rotation.x = -mouseY + scrollY * 0.0005;
      mainGroup.position.y = -scrollY * 0.0012;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Redimensionnement réactif
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-clay-950 via-clay-900 to-clay-800 rounded-3xl border border-terracotta-500/20">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full border-2 border-harvest-400/40 flex items-center justify-center bg-clay-800/80">
            <svg className="w-10 h-10 text-harvest-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-serif text-base text-harvest-300">TERRANOVA 3D Precision</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[480px] sm:h-[580px] lg:h-[680px] relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
