import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const HomePage = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Particle system
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      const radius = 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Color gradient
      const hue = 0.65 + Math.random() * 0.1; // Purple-blue range
      const saturation = 0.8;
      const lightness = 0.5 + Math.random() * 0.3;
      
      colors[i3] = hue;
      colors[i3 + 1] = saturation;
      colors[i3 + 2] = lightness;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Mouse interaction
    const mouse = new THREE.Vector2(0, 0);
    
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();
      
      // Slow rotation
      particles.rotation.x = elapsedTime * 0.05;
      particles.rotation.y = elapsedTime * 0.03;
      
      // Mouse interaction effect
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Particle movement
      const positions = geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create a gentle pulsing effect
        const pulse = Math.sin(elapsedTime * 0.5 + i * 0.01) * 0.1;
        
        positions[i3] += (Math.random() - 0.5) * pulse;
        positions[i3 + 1] += (Math.random() - 0.5) * pulse;
        positions[i3 + 2] += (Math.random() - 0.5) * pulse;
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
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);
  
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10"
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                    <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  AI Web Studio
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Examples</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </nav>
              <Link to="/builder" className="px-6 py-3 rounded-xl shadow-lg font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <span>Go to Builder</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Build Websites</span> <br />with AI in Seconds
              </h1>
              <p className="text-xl text-gray-200 mb-10 bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                Describe your website and let our AI generate the code for you. No design skills required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/builder" className="px-8 py-4 rounded-xl shadow-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.03] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <span>Start Building</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <button className="px-8 py-4 rounded-xl shadow-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.03] bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>View Demo</span>
                </button>
              </div>
            </div>
            
            {/* 3D Animation Placeholder */}
            <div className="lg:w-1/2 w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-gray-900/30 backdrop-blur-sm border border-gray-700 shadow-2xl flex items-center justify-center">
              <div className="text-center p-6">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Real-time 3D Background</h3>
                <p className="text-gray-400">Interactive particle system responding to your movements</p>
              </div>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-1 hover:scale-[1.03] transition-transform duration-300 backdrop-blur-sm">
              <div className="bg-gray-900/30 rounded-xl p-6 h-full">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-100">AI-Powered</h3>
                <p className="text-gray-300">Our advanced AI understands your requirements and generates clean, responsive code.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-1 hover:scale-[1.03] transition-transform duration-300 backdrop-blur-sm">
              <div className="bg-gray-900/30 rounded-xl p-6 h-full">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-100">Real-Time Preview</h3>
                <p className="text-gray-300">See your website come to life as you make changes with live preview.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-1 hover:scale-[1.03] transition-transform duration-300 backdrop-blur-sm">
              <div className="bg-gray-900/30 rounded-xl p-6 h-full">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-100">Export & Download</h3>
                <p className="text-gray-300">Download your generated website as a single HTML file to use anywhere.</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-t border-gray-700 py-12 mt-24 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    AI Web Studio
                  </h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Transform your ideas into functional websites with the power of AI. No design skills required.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="bg-gray-800/50 p-2 rounded-full hover:bg-blue-600 transition-colors backdrop-blur-sm">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </a>
                  <a href="#" className="bg-gray-800/50 p-2 rounded-full hover:bg-blue-700 transition-colors backdrop-blur-sm">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="bg-gray-800/50 p-2 rounded-full hover:bg-purple-600 transition-colors backdrop-blur-sm">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-200">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Examples</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Templates</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-200">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Tutorials</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">API Reference</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Community</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-200">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Blog</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© {new Date().getFullYear()} AI Web Studio. All rights reserved.</p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;