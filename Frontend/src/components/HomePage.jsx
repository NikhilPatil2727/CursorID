import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

const HomePage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle system
    const particleCount = 1800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Position (spherical distribution)
      const radius = 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Color gradient (cool blues with purple accents)
      const hue = 0.62 + Math.random() * 0.12;
      const saturation = 0.8;
      const lightness = 0.5 + Math.random() * 0.3;

      colors[i3] = hue;
      colors[i3 + 1] = saturation;
      colors[i3 + 2] = lightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction
    const mouse = new THREE.Vector2(0, 0);
    const targetCameraPosition = new THREE.Vector3(0, 0, 5);

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Slow rotation with easing
      particles.rotation.x +=
        (elapsedTime * 0.03 - particles.rotation.x) * 0.05;
      particles.rotation.y +=
        (elapsedTime * 0.02 - particles.rotation.y) * 0.03;

      // Mouse interaction effect (smooth camera movement)
      targetCameraPosition.x = mouse.x * 0.8;
      targetCameraPosition.y = mouse.y * 0.6;
      camera.position.lerp(targetCameraPosition, 0.1);
      camera.lookAt(scene.position);

      // Particle movement with physics-based simulation
      const positions = geometry.attributes.position.array;
      const originalPositions = new Float32Array(positions);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Return to original position with inertia
        const dx = originalPositions[i3] - positions[i3];
        const dy = originalPositions[i3 + 1] - positions[i3 + 1];
        const dz = originalPositions[i3 + 2] - positions[i3 + 2];

        positions[i3] += dx * 0.05;
        positions[i3 + 1] += dy * 0.05;
        positions[i3 + 2] += dz * 0.05;

        // Add subtle noise-based movement
        const noise = Math.sin(elapsedTime * 0.3 + i * 0.1) * 0.08;
        positions[i3] += (Math.random() - 0.5) * noise;
        positions[i3 + 1] += (Math.random() - 0.5) * noise;
        positions[i3 + 2] += (Math.random() - 0.5) * noise;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-inter">
      {/* Enhanced 3D Canvas Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900 z-0" />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Professional Header */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/90 border-b border-indigo-500/30 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl transition-all duration-300 group-hover:rotate-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">
                  WebCraft
                </h1>
              </Link>

              {/* Centered Navigation - Adjusted padding */}
              <nav className="flex space-x-6 ml-auto">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-purple-300 transition-colors duration-300 px-4 py-2 font-medium"
                >
                  Features
                </a>
                <a
                  href="#contact"
                  className="text-gray-300 hover:text-purple-300 transition-colors duration-300 px-4 py-2 font-medium"
                >
                  Contact
                </a>
              </nav>

              <div className="flex items-center">
                <Link
                  to="/builder"
                  className="px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-[1.03] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20"
                >
                  <span>Start Building</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Build Stunning Websites
                    </span>
                    <br />
                    <span className="text-gray-200">with AI in Seconds</span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0">
                    Describe your vision and let our AI generate
                    production-ready code. No design skills required — just pure
                    innovation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      to="/builder"
                      className="px-8 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.03] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/30"
                    >
                      <span>Create Your Site</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="lg:w-1/2 w-full max-w-2xl">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl transform rotate-3 blur-xl"></div>
                    <div className="relative bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-1 overflow-hidden">
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8">
                        <div className="flex justify-between mb-6">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex">
                            <div className="text-cyan-400 mr-4">1</div>
                            <div className="text-purple-300">
                              // Describe your website
                            </div>
                          </div>
                          <div className="flex">
                            <div className="text-cyan-400 mr-4">2</div>
                            <div>
                              <span className="text-blue-400">const</span>
                              <span className="text-rose-400"> website</span>
                              <span className="text-gray-400"> = </span>
                              <span className="text-emerald-400">
                                AI.create
                              </span>
                              <span className="text-gray-300">(</span>
                              <span className="text-yellow-300">
                                "Modern SaaS platform"
                              </span>
                              <span className="text-gray-300">);</span>
                            </div>
                          </div>
                          <div className="flex">
                            <div className="text-cyan-400 mr-4">3</div>
                            <div className="text-gray-300">
                              // Preview and customize
                            </div>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-800 flex items-center">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-200">
                              Real-time code generation
                            </div>
                            <div className="text-gray-400 text-sm">
                              Instantly see your website come to life
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="py-20 bg-gradient-to-b from-gray-900/0 to-indigo-900/10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Professional Web Development
                  </span>
                  <span className="text-gray-200"> Made Simple</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Everything you need to build production-ready websites with
                  HTML, CSS & JavaScript
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "HTML/CSS/JS Generation",
                    description:
                      "AI generates clean, semantic HTML, CSS, and JavaScript code ready for production deployment.",
                    gradient: "from-blue-500 to-blue-600",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Live Preview Editor",
                    description:
                      "Real-time visual feedback as you code with instant preview of HTML/CSS/JS changes.",
                    gradient: "from-purple-500 to-purple-600",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Responsive by Default",
                    description:
                      "Automatically generated responsive layouts that work on all devices and screen sizes.",
                    gradient: "from-pink-500 to-pink-600",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "CSS Framework Integration",
                    description:
                      "Seamless integration with Tailwind CSS, Bootstrap, and other popular frameworks.",
                    gradient: "from-cyan-500 to-cyan-600",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "JavaScript Interactions",
                    description:
                      "Create dynamic interfaces with clean JavaScript for animations and user interactions.",
                    gradient: "from-indigo-500 to-indigo-600",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Cross-Browser Compatibility",
                    description:
                      "Code that works consistently across all modern browsers with automatic prefixing.",
                    gradient: "from-violet-500 to-violet-600",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-1 hover:-translate-y-2 transition-transform duration-300 backdrop-blur-sm"
                  >
                    <div className="bg-gray-900/30 rounded-xl p-6 h-full">
                      <div
                        className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}
                      >
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-100">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-1 backdrop-blur-sm">
                <div className="bg-gray-900/70 rounded-3xl p-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      Transform
                    </span>{" "}
                    Your Workflow?
                  </h2>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Build better websites faster with our AI-powered platform.
                  </p>
                  <Link
                    to="/builder"
                    className="inline-flex items-center px-8 py-4 rounded-xl font-medium space-x-2 transition-all duration-300 transform hover:scale-[1.03] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/30 text-lg"
                  >
                    <span>Start Building Free</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Professional Footer */}
        <footer
          id="contact"
          className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-t border-gray-700 py-16 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  WebCraft
                </h3>
              </div>
              <p className="text-gray-300 mb-8 max-w-md">
                The next-generation AI website builder for developers,
                designers, and content creators.
              </p>
              <div className="flex space-x-4 mb-8">
                {[
                  {
                    name: "Twitter",
                    url: "https://x.com/nikhil_patil27",
                    icon: (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    ),
                  },
                  {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/in/nikhil-patil-967986251/",
                    icon: (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                  },
                  {
                    name: "GitHub",
                    url: "https://github.com/NikhilPatil2727",
                    icon: (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800/50 p-3 rounded-full hover:bg-blue-600 transition-colors backdrop-blur-sm"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Simplified Footer Links */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {["Features", "About", "Contact"].map(
                  (item, index) => (
                    <a
                      key={index}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>

              <div className="border-t border-gray-700 w-full pt-8 text-center">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} WebCraft AI. All rights reserved.
                </p>
                <div className="mt-4 flex justify-center space-x-6">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-200 text-sm"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-200 text-sm"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;