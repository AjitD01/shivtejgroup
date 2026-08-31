/**
 * Antigravity 3D Spatial Engine for Shivtej Industries
 * Powers a seamless, single continuous 3D page experience:
 * 1. Global 3D Spatial Depth & Scroll-driven Camera Physics
 * 2. Multi-plane 3D Holographic Card & Element Parallax
 * 3. Interactive Photorealistic 3D Foam Product Inspector
 */

// --------------------------------------------------------------------------
// 1. Procedural Texture Generators
// --------------------------------------------------------------------------
const FoamTextureFactory = {
  createClosedCellTexture: function() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 0.5 + Math.random() * 1.5;
      const brightness = Math.floor(40 + Math.random() * 160);
      ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  },

  createTapeCoreTexture: function() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let x = 80; x < 512; x += 160) {
      ctx.fillText('SHIVTEJ FOAM', x, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }
};

// --------------------------------------------------------------------------
// 2. Photorealistic 3D Product Factory (For Product Inspector)
// --------------------------------------------------------------------------
const ProductMeshFactory = {
  createTapeRoll: function() {
    const group = new THREE.Group();
    const foamTexture = FoamTextureFactory.createClosedCellTexture();
    const coreTexture = FoamTextureFactory.createTapeCoreTexture();

    const coreGeom = new THREE.CylinderGeometry(1.2, 1.2, 1.0, 36, 1, true);
    const coreMat = new THREE.MeshStandardMaterial({
      map: coreTexture,
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    group.add(new THREE.Mesh(coreGeom, coreMat));

    const extrudeSettings = { depth: 0.96, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 2.2, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 1.2, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const rollGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    rollGeom.center();

    const rollMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      bumpMap: foamTexture,
      bumpScale: 0.04,
      roughness: 0.85,
      metalness: 0.05
    });

    const rollMesh = new THREE.Mesh(rollGeom, rollMat);
    rollMesh.rotation.x = Math.PI / 2;
    group.add(rollMesh);

    const tabCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(2.18, 0, 0),
      new THREE.Vector3(2.6, 0.4, 0.2),
      new THREE.Vector3(2.9, 1.0, 0.5),
      new THREE.Vector3(3.2, 1.4, 0.8)
    );
    const tabGeom = new THREE.TubeGeometry(tabCurve, 16, 0.45, 8, false);
    const tabMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      roughness: 0.2,
      transmission: 0.5,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    group.add(new THREE.Mesh(tabGeom, tabMat));

    return group;
  },

  createPrecisionGasket: function() {
    const group = new THREE.Group();
    const foamTexture = FoamTextureFactory.createClosedCellTexture();

    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1.8, 0, Math.PI * 2, false);

    const hole = new THREE.Path();
    hole.absarc(0, 0, 1.0, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const bx = Math.cos(angle) * 1.45;
      const by = Math.sin(angle) * 1.45;
      const boltHole = new THREE.Path();
      boltHole.absarc(bx, by, 0.15, 0, Math.PI * 2, true);
      shape.holes.push(boltHole);
    }

    const extrudeSettings = { depth: 0.28, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      bumpMap: foamTexture,
      bumpScale: 0.05,
      roughness: 0.7,
      metalness: 0.15
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = Math.PI / 2;
    group.add(mesh);
    return group;
  },

  createAcousticFoamTile: function() {
    const group = new THREE.Group();
    const foamTexture = FoamTextureFactory.createClosedCellTexture();

    const baseGeom = new THREE.BoxGeometry(3.2, 0.2, 3.2);
    const foamMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      bumpMap: foamTexture,
      bumpScale: 0.04,
      roughness: 0.8
    });
    group.add(new THREE.Mesh(baseGeom, foamMat));

    const pyramidGeom = new THREE.ConeGeometry(0.35, 0.6, 4);
    pyramidGeom.rotateY(Math.PI / 4);

    for (let r = -3; r <= 3; r += 2) {
      for (let c = -3; c <= 3; c += 2) {
        const pyramid = new THREE.Mesh(pyramidGeom, foamMat);
        pyramid.position.set(r * 0.45, 0.4, c * 0.45);
        group.add(pyramid);
      }
    }
    return group;
  },

  createLayeredFoamSheet: function() {
    const group = new THREE.Group();
    const foamTexture = FoamTextureFactory.createClosedCellTexture();

    // Layer 1: Silicone Release Liner
    const geom1 = new THREE.BoxGeometry(3.6, 0.08, 2.4);
    const mat1 = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      roughness: 0.2,
      transparent: true,
      opacity: 0.95
    });
    const layer1 = new THREE.Mesh(geom1, mat1);
    layer1.userData = { normalY: -0.55, explodedY: -1.2, name: 'Release Liner' };
    layer1.position.y = layer1.userData.normalY;
    group.add(layer1);

    // Layer 2: Acrylic Adhesive
    const geom2 = new THREE.BoxGeometry(3.55, 0.05, 2.35);
    const mat2 = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const layer2 = new THREE.Mesh(geom2, mat2);
    layer2.userData = { normalY: -0.32, explodedY: -0.5, name: 'Adhesive Layer' };
    layer2.position.y = layer2.userData.normalY;
    group.add(layer2);

    // Layer 3: Foam Core
    const geom3 = new THREE.BoxGeometry(3.5, 0.55, 2.3);
    const mat3 = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      bumpMap: foamTexture,
      bumpScale: 0.06,
      roughness: 0.85
    });
    const layer3 = new THREE.Mesh(geom3, mat3);
    layer3.userData = { normalY: 0.08, explodedY: 0.2, name: 'EPDM Foam Core' };
    layer3.position.y = layer3.userData.normalY;
    group.add(layer3);

    // Layer 4: Top Protective Film
    const geom4 = new THREE.BoxGeometry(3.55, 0.06, 2.35);
    const mat4 = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85
    });
    const layer4 = new THREE.Mesh(geom4, mat4);
    layer4.userData = { normalY: 0.42, explodedY: 0.95, name: 'Protective Film' };
    layer4.position.y = layer4.userData.normalY;
    group.add(layer4);

    return group;
  }
};

// --------------------------------------------------------------------------
// 3. Global 3D Spatial Canvas Engine (Creates a unified 3D page world)
// --------------------------------------------------------------------------
class Global3DSpatialEngine {
  constructor() {
    this.canvasContainer = document.getElementById('global3DCanvas');
    if (!this.canvasContainer || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.spatialMeshGroup = null;
    this.particles = null;
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 20);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasContainer.appendChild(this.renderer.domElement);

    // Spatial Lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(amb);

    const light1 = new THREE.PointLight(0xf97316, 2.0, 50);
    light1.position.set(15, 10, 10);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0x0ea5e9, 1.8, 50);
    light2.position.set(-15, -10, 10);
    this.scene.add(light2);

    this.spatialMeshGroup = new THREE.Group();
    this.scene.add(this.spatialMeshGroup);

    // Create 3D Spatial Depth Grid Matrix
    this.createSpatialDepthMatrix();

    // Create Micro-Polymer Floating Dust
    this.createFloatingPolymerDust();

    // Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    this.animate();
  }

  createSpatialDepthMatrix() {
    // 3D Polymer Cellular Grid Lines
    const gridHelper = new THREE.GridHelper(80, 40, 0xf97316, 0x1e293b);
    gridHelper.position.y = -8;
    gridHelper.rotation.x = 0.15;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    this.spatialMeshGroup.add(gridHelper);

    // Geometric 3D Polymer Structural Nodes at deep Z depths
    const nodeGeom = new THREE.OctahedronGeometry(0.6, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    for (let i = 0; i < 12; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 40,
        -5 - Math.random() * 20
      );
      node.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.spatialMeshGroup.add(node);
    }
  }

  createFloatingPolymerDust() {
    const count = 110;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cOrange = new THREE.Color(0xf97316);
    const cCyan = new THREE.Color(0x38bdf8);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const pick = Math.random() > 0.6 ? cOrange : (Math.random() > 0.5 ? cCyan : cWhite);
      col[i * 3] = pick.r;
      col[i * 3 + 1] = pick.g;
      col[i * 3 + 2] = pick.b;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geom, mat);
    this.scene.add(this.particles);
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = window.scrollY / (maxScroll || 1);
    this.targetScrollY = progress * 16; // 3D Camera depth travel (gentle)
  }

  onMouseMove(e) {
    this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const elapsed = this.clock.getElapsedTime();

    // Smooth 3D scroll inertia
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.05;

    // Smooth camera orientation (subtle sway)
    this.camera.position.y = -this.scrollY * 0.5;
    this.camera.rotation.x = this.mouseY * 0.025 - (this.scrollY * 0.008);
    this.camera.rotation.y = this.mouseX * 0.025;

    // Gentle rotation of background spatial elements
    if (this.spatialMeshGroup) {
      this.spatialMeshGroup.rotation.y = elapsed * 0.02;
    }

    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// --------------------------------------------------------------------------
// 4. Interactive 3D Product Inspector (Tape, Gasket, Layered Sheet, Acoustic)
// --------------------------------------------------------------------------
class AntigravityFoamVisualizer {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.currentModel = null;
    this.isExploded = false;
    this.isWireframe = false;
    this.currentMode = 'layered';

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 320;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(4.2, 3.2, 5.2);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    this.scene.add(dirLight);

    const pLight1 = new THREE.PointLight(0xf97316, 2.5, 20);
    pLight1.position.set(5, 4, 5);
    this.scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x38bdf8, 2.0, 20);
    pLight2.position.set(-5, -3, 3);
    this.scene.add(pLight2);

    this.loadModel('layered');
    this.setupInteractivity();
    window.addEventListener('resize', this.onResize.bind(this));
    this.animate();
  }

  onResize() {
    if (!this.renderer || !this.camera || !this.container) return;
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 320;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  disposeModel(model) {
    if (!model) return;
    model.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : (child.material ? [child.material] : []);
      materials.forEach((mat) => {
        if (mat.map) mat.map.dispose();
        if (mat.bumpMap) mat.bumpMap.dispose();
        if (mat.normalMap) mat.normalMap.dispose();
        mat.dispose();
      });
    });
  }

  loadModel(mode) {
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
      this.disposeModel(this.currentModel);
    }
    this.currentMode = mode;
    this.isExploded = false;

    const explodeBtn = document.getElementById('explode3dBtn');
    if (explodeBtn) explodeBtn.innerText = 'Explode 3D Layers';

    if (mode === 'gasket') {
      this.currentModel = ProductMeshFactory.createPrecisionGasket();
    } else if (mode === 'tape') {
      this.currentModel = ProductMeshFactory.createTapeRoll();
    } else if (mode === 'acoustic') {
      this.currentModel = ProductMeshFactory.createAcousticFoamTile();
    } else {
      this.currentModel = ProductMeshFactory.createLayeredFoamSheet();
    }

    // Preserve wireframe state across model switches
    if (this.isWireframe) {
      this.currentModel.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = true;
        }
      });
    }

    this.scene.add(this.currentModel);
  }

  setupInteractivity() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.currentModel) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      this.currentModel.rotation.y += deltaX * 0.01;
      this.currentModel.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0 || !this.currentModel) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      this.currentModel.rotation.y += deltaX * 0.01;
      this.currentModel.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    const explodeBtn = document.getElementById('explode3dBtn');
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        this.isExploded = !this.isExploded;
        explodeBtn.innerText = this.isExploded ? 'Collapse 3D Layers' : 'Explode 3D Layers';
      });
    }

    const wireframeBtn = document.getElementById('wireframe3dBtn');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        this.isWireframe = !this.isWireframe;
        if (this.currentModel) {
          this.currentModel.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.wireframe = this.isWireframe;
            }
          });
        }
        wireframeBtn.innerText = this.isWireframe ? 'Solid 3D View' : 'Wireframe Polymer View';
      });
    }

    const modeToggles = document.querySelectorAll('.model-3d-toggle');
    modeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        modeToggles.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.loadModel(mode);
      });
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (this.currentModel) {
      this.currentModel.rotation.y += 0.005;

      if (this.currentModel.children) {
        this.currentModel.children.forEach(child => {
          if (child.userData && child.userData.normalY !== undefined) {
            const targetY = this.isExploded ? child.userData.explodedY : child.userData.normalY;
            child.position.y += (targetY - child.position.y) * 0.1;
          }
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// --------------------------------------------------------------------------
// 5. 3D Spatial Holographic Parallax (Whole Page 3D Surface Feel)
// --------------------------------------------------------------------------
const CARD_SELECTOR =
  '.product-card, .industry-card, .why-choose-card, .value-card, .vision-card, .mission-card, .contact-card-box, .hero-3d-interactive-card, .hr-service-card, .division-portal-card, .testimonial-card';

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setupGlobal3DSpatialParallax() {
  if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll(CARD_SELECTOR);

  cards.forEach(card => {
    card.classList.add('ag-tilt');

    // Inject a moving light glare layer for a holographic sheen
    let glare = card.querySelector('.ag-glare');
    if (!glare) {
      glare = document.createElement('span');
      glare.className = 'ag-glare';
      card.appendChild(glare);
    }

    let rafId = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1

      const rotateX = (py - 0.5) * -6;
      const rotateY = (px - 0.5) * 6;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform =
          `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
        glare.style.opacity = '1';
        glare.style.background =
          `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.14), rgba(255,255,255,0) 50%)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform =
        'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      glare.style.opacity = '0';
    });
  });
}

// --------------------------------------------------------------------------
// 6. Staggered Depth Scroll Reveal (elements float up from the Z-axis)
// --------------------------------------------------------------------------
function setupScrollReveal() {
  const targets = document.querySelectorAll(
    '.section-header, ' + CARD_SELECTOR + ', .metric-card, .journey-content'
  );
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('ag-visible'));
    return;
  }

  targets.forEach(t => t.classList.add('ag-reveal'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Stagger siblings within the same grid/row for a domino effect
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter(c => c.classList.contains('ag-reveal'))
        : [el];
      const idx = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = Math.min(idx * 55, 275) + 'ms';
      el.classList.add('ag-visible');
      // Free the compositor layer once the entrance finishes
      el.addEventListener('transitionend', () => { el.style.willChange = 'auto'; }, { once: true });
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(t => observer.observe(t));
}

document.addEventListener('DOMContentLoaded', () => {
  new Global3DSpatialEngine();
  new AntigravityFoamVisualizer('antigravityVisualizerCanvas');
  setupGlobal3DSpatialParallax();
  setupScrollReveal();
});
