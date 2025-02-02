import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as THREE from "three";

const ParticleBackground = forwardRef((props, ref) => {
  const {
    particleCount = 250,
    particleSize = 0.14,
    particleColor = "#4a90e2",
    particleOpacity = 1,
    rotationSpeed = 0.001,
    particleSpeed = 0.001,
    spread = 20,
    depth = 20,
    showConnections = true,
    connectionDistance = 2.5,
    connectionColor = "#4a90e2",
    connectionOpacity = 0.5,
  } = props;

  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesGroupRef = useRef(null);
  const particlesRef = useRef([]);
  const velocitiesRef = useRef([]);
  const currentColorRef = useRef(particleColor);
  const currentLineColorRef = useRef(connectionColor);
  const materialRef = useRef(null);
  const linesMaterialRef = useRef(null);
  const linesRef = useRef(null);
  const linesGeometryRef = useRef(null);
  const particleGeometryRef = useRef(null);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    changeColor: (particleNewColor, lineNewColor, duration = 1) => {
      if (!materialRef.current || !linesMaterialRef.current) return;

      // Setup particle color transition
      const startParticleColor = new THREE.Color(currentColorRef.current);
      const endParticleColor = new THREE.Color(particleNewColor);

      // Setup line color transition
      const startLineColor = new THREE.Color(currentLineColorRef.current);
      const endLineColor = new THREE.Color(lineNewColor || particleNewColor); // If no line color provided, use particle color

      const startTime = performance.now();

      const animateColor = () => {
        const currentTime = performance.now();
        const elapsed = (currentTime - startTime) / 1000;

        if (elapsed < duration) {
          const t = elapsed / duration;

          // Interpolate particle color
          const currentParticleColor = new THREE.Color(
            startParticleColor.r +
              (endParticleColor.r - startParticleColor.r) * t,
            startParticleColor.g +
              (endParticleColor.g - startParticleColor.g) * t,
            startParticleColor.b +
              (endParticleColor.b - startParticleColor.b) * t
          );

          // Interpolate line color
          const currentLineColor = new THREE.Color(
            startLineColor.r + (endLineColor.r - startLineColor.r) * t,
            startLineColor.g + (endLineColor.g - startLineColor.g) * t,
            startLineColor.b + (endLineColor.b - startLineColor.b) * t
          );

          materialRef.current.color = currentParticleColor;
          linesMaterialRef.current.color = currentLineColor;
          requestAnimationFrame(animateColor);
        } else {
          // Set final colors
          materialRef.current.color = endParticleColor;
          linesMaterialRef.current.color = endLineColor;
          currentColorRef.current = particleNewColor;
          currentLineColorRef.current = lineNewColor || particleNewColor;
        }
      };

      animateColor();
    },
  }));

  useEffect(() => {
    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    const renderer = rendererRef.current;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current?.appendChild(renderer.domElement);

    // Create particles
    particlesGroupRef.current = new THREE.Group();
    particleGeometryRef.current = new THREE.SphereGeometry(particleSize, 16, 8);
    materialRef.current = new THREE.MeshBasicMaterial({
      color: new THREE.Color(currentColorRef.current),
      transparent: true,
      opacity: particleOpacity,
    });

    // Create lines material before using it
    linesMaterialRef.current = new THREE.LineBasicMaterial({
      color: new THREE.Color(connectionColor),
      transparent: true,
      opacity: connectionOpacity,
    });

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(
        particleGeometryRef.current,
        materialRef.current
      );
      particle.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      particlesGroupRef.current.add(particle);
      particlesRef.current.push(particle);

      velocitiesRef.current.push({
        x: (Math.random() - 0.5) * particleSpeed,
        y: (Math.random() - 0.5) * particleSpeed,
        z: (Math.random() - 0.5) * particleSpeed,
      });
    }

    sceneRef.current.add(particlesGroupRef.current);
    cameraRef.current.position.z = 15;

    // Create connection lines
    linesGeometryRef.current = new THREE.BufferGeometry();
    linesRef.current = new THREE.LineSegments(
      linesGeometryRef.current,
      linesMaterialRef.current
    );

    if (showConnections) {
      sceneRef.current.add(linesRef.current);
    }

    // Animation
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!particlesGroupRef.current) return;

      // Rotate particle group
      particlesGroupRef.current.rotation.x += rotationSpeed;
      particlesGroupRef.current.rotation.y += rotationSpeed * 0.5;

      // Update individual particle positions
      particlesRef.current.forEach((particle, index) => {
        const velocity = velocitiesRef.current[index];

        particle.position.x += velocity.x;
        particle.position.y += velocity.y;
        particle.position.z += velocity.z;

        // Bounce particles off boundaries
        const bounceCheck = (pos, vel, limit) => {
          if (Math.abs(pos) > limit) {
            return -vel;
          }
          return vel;
        };

        velocity.x = bounceCheck(particle.position.x, velocity.x, spread / 2);
        velocity.y = bounceCheck(particle.position.y, velocity.y, spread / 2);
        velocity.z = bounceCheck(particle.position.z, velocity.z, depth / 2);
      });

      // Update connection lines
      if (showConnections && linesGeometryRef.current) {
        const positions = [];

        // Check distances between particles and create lines
        for (let i = 0; i < particlesRef.current.length; i++) {
          const particle1 = particlesRef.current[i];

          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const particle2 = particlesRef.current[j];
            const distance = particle1.position.distanceTo(particle2.position);

            if (distance < connectionDistance) {
              positions.push(
                particle1.position.x,
                particle1.position.y,
                particle1.position.z,
                particle2.position.x,
                particle2.position.y,
                particle2.position.z
              );
            }
          }
        }

        linesGeometryRef.current.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        linesGeometryRef.current.attributes.position.needsUpdate = true;
      }

      renderer.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean up Three.js objects
      if (particleGeometryRef.current) {
        particleGeometryRef.current.dispose();
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (linesMaterialRef.current) {
        linesMaterialRef.current.dispose();
      }
      if (linesGeometryRef.current) {
        linesGeometryRef.current.dispose();
      }

      // Remove particles from group
      if (particlesGroupRef.current) {
        particlesRef.current.forEach((particle) => {
          particlesGroupRef.current.remove(particle);
        });
      }

      // Clear arrays
      particlesRef.current = [];
      velocitiesRef.current = [];

      // Remove renderer
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [
    particleCount,
    particleSize,
    particleColor,
    particleOpacity,
    rotationSpeed,
    particleSpeed,
    spread,
    depth,
    showConnections,
    connectionDistance,
    connectionColor,
    connectionOpacity,
  ]);

  return <div ref={containerRef} className="absolute inset-0 -z-10" />;
});

export default ParticleBackground;
