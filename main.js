/* ========================================================================
   RAPTOR 1 - 3D SCROLL-DRIVEN ENGINE ASSEMBLY ANIMATION
   Three.js with procedural geometry (placeholder for .glb model)
   Cinematic camera, lighting, and smooth scroll-based timeline
   ======================================================================== */

// ===================================
// CORE VARIABLES & SCENE SETUP
// ===================================
let scene, camera, renderer;
let engineParts = {}; // Store all engine components
let animationState = {
    scrollProgress: 0,
    currentStage: 0,
    targetRotation: { x: 0, y: 0 }
};

// Canvas and DOM elements
const canvas = document.getElementById('raptor-canvas');
const progressFill = document.getElementById('progress-fill');
const stageInfo = document.getElementById('stage-info');
const stageLabel = stageInfo.querySelector('.stage-label');
const stagePercent = document.getElementById('stage-percent');
const loadingOverlay = document.getElementById('loading-overlay');
const loadPercent = document.getElementById('load-percent');

// ===================================
// INITIALIZATION
// ===================================
function init() {
    // Force scroll to top on page load/refresh
    window.scrollTo(0, 0);

    // Reset animation state
    animationState.scrollProgress = 0;
    animationState.currentStage = 0;

    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 20, 100);

    // Setup camera - perspective with cinematic FOV
    camera = new THREE.PerspectiveCamera(
        50, // Field of view (narrower for cinematic feel)
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 25); // Start far away
    camera.lookAt(0, 0, 0);

    // Setup WebGL renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Setup lighting
    setupLighting();

    // Create engine parts (placeholder procedural geometry)
    createEngineParts();

    // Setup scroll listener
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onWindowResize);

    // Simulate loading completion
    simulateLoading();

    // Start animation loop
    animate();
}

// ===================================
// LIGHTING SETUP
// ===================================
function setupLighting() {
    // Ambient light - soft overall illumination
    const ambientLight = new THREE.AmbientLight(0x4060a0, 0.3);
    scene.add(ambientLight);

    // Main directional light - key light from upper-right
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Rim light - blue accent from left
    const rimLight = new THREE.PointLight(0x00d9ff, 0.8, 50);
    rimLight.position.set(-15, 5, 5);
    scene.add(rimLight);

    // Core glow light (will intensify during ignition stage)
    const coreLight = new THREE.PointLight(0xff6b00, 0, 10);
    coreLight.position.set(0, 0, 0);
    coreLight.name = 'coreLight';
    scene.add(coreLight);
}

// ===================================
// CREATE ENGINE PARTS (PROCEDURAL GEOMETRY)
// ===================================

function createEngineParts() {
    // Material definitions
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.2
    });

    const emissiveMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0xff6b00,
        emissiveIntensity: 0 // Start dark, will glow later
    });

    // 1. BASE RING (outer ring structure)
    const baseRingGeometry = new THREE.TorusGeometry(3, 0.3, 16, 32);
    const baseRing = new THREE.Mesh(baseRingGeometry, metalMaterial);
    baseRing.position.set(0, -2, 0);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.initialPosition = { x: -20, y: -2, z: 0 }; // Start off-screen
    baseRing.position.x = baseRing.initialPosition.x;
    scene.add(baseRing);
    engineParts.baseRing = baseRing;

    // 2. COMBUSTION CHAMBER (main cylinder)
    const chamberGeometry = new THREE.CylinderGeometry(2, 2.5, 4, 32);
    const chamber = new THREE.Mesh(chamberGeometry, metalMaterial);
    chamber.position.set(0, 1, 0);
    chamber.initialPosition = { x: 0, y: 15, z: 0 }; // Start above
    chamber.position.y = chamber.initialPosition.y;
    scene.add(chamber);
    engineParts.chamber = chamber;

    // 3. TURBOPUMP HOUSING (smaller cylinder on side)
    const turbopumpGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 24);
    const turbopump = new THREE.Mesh(turbopumpGeometry, metalMaterial);
    turbopump.position.set(3.5, 1, 0);
    turbopump.rotation.z = Math.PI / 2;
    turbopump.initialPosition = { x: 20, y: 1, z: 0 }; // Start off-screen right
    turbopump.position.x = turbopump.initialPosition.x;
    scene.add(turbopump);
    engineParts.turbopump = turbopump;

    // 4. PREBURNER PIPES (small cylinders connecting)
    const pipeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 12);
    const pipe1 = new THREE.Mesh(pipeGeometry, metalMaterial);
    pipe1.position.set(-2.5, 1, 1);
    pipe1.rotation.x = Math.PI / 4;
    pipe1.initialPosition = { x: -15, y: 1, z: 1 };
    pipe1.position.x = pipe1.initialPosition.x;
    scene.add(pipe1);
    engineParts.pipe1 = pipe1;

    const pipe2 = new THREE.Mesh(pipeGeometry.clone(), metalMaterial);
    pipe2.position.set(-2.5, 1, -1);
    pipe2.rotation.x = -Math.PI / 4;
    pipe2.initialPosition = { x: -15, y: 1, z: -1 };
    pipe2.position.x = pipe2.initialPosition.x;
    scene.add(pipe2);
    engineParts.pipe2 = pipe2;

    // 5. ENGINE CORE (glowing center sphere)
    const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const core = new THREE.Mesh(coreGeometry, emissiveMaterial);
    core.position.set(0, 1, 0);
    scene.add(core);
    engineParts.core = core;
    engineParts.core.material = emissiveMaterial; // Store reference for glow control

    // up above the nozzle a lil component for ch4 pipekinda

    // 6. NOZZLE (cone at bottom)

    // Create a lathe shape for the nozzle
    const points = [];
    for (let i = 0; i < 10; ++i) { points.push(new THREE.Vector2(Math.sin(i * 0.16) * 3 + 3, (i - 5) * 1)); }
    const segments = 80;
    const phiStart = Math.PI * 0; // usually start from 0
    const phiLength = Math.PI * 2 // full rotation
    // Create the geometry
    const nozzleGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    // Create the mesh with a material
    const nozzle = new THREE.Mesh(nozzleGeometry, metalMaterial);
    nozzle.position.set(0, -4, 0);
    nozzle.initialPosition = { x: 0, y: -10, z: 0 }; // Start below
    nozzle.position.y = nozzle.initialPosition.y;
    nozzle.rotation.x = Math.PI;
    // Add to scene
    scene.add(nozzle);
    engineParts.nozzle = nozzle;


    // 6. NOZZLE (cone at bottom)

    // Create a lathe shape for the nozzle
    // const points = [];
    // for (let i = 0; i < 10; ++i) { points.push(new THREE.Vector2(Math.sin(i * 0.16) * 3 + 3, (i - 5) * 1)); }
    // const segments = 80;
    // const phiStart = Math.PI * 0; // usually start from 0
    // const phiLength = Math.PI * 2 // full rotation
    // // Create the geometry
    // const nozzleGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    // // Create the mesh with a material
    // const nozzle = new THREE.Mesh(nozzleGeometry, metalMaterial);
    // nozzle.position.set(0, -4, 0);
    // nozzle.initialPosition = { x: 0, y: -10, z: 0 }; // Start below
    // nozzle.position.y = nozzle.initialPosition.y;
    // nozzle.rotation.x = Math.PI;
    // // Add to scene
    // scene.add(nozzle);
    // engineParts.nozzle = nozzle;

    // engineParts.nozzle 
    // const nozzleGeometry = new THREE.ConeGeometry(3.5, 5, 32);
    // // ConeGeometry(radi,height,radialsegments)
    // const nozzle = new THREE.Mesh(nozzleGeometry, metalMaterial);
    // nozzle.position.set(0, -4, 0);
    // nozzle.initialPosition = { x: 0, y: -20, z: 0 }; // Start below
    // nozzle.position.y = nozzle.initialPosition.y;
    // scene.add(nozzle);
    // engineParts.nozzle = nozzle;

    // 7. EXHAUST RING (additional detail at base)
    const exhaustRingGeometry = new THREE.TorusGeometry(2.5, 0.2, 16, 32);
    const exhaustRing = new THREE.Mesh(exhaustRingGeometry, metalMaterial);
    exhaustRing.position.set(0, -6, 0);
    exhaustRing.rotation.x = Math.PI / 2;
    exhaustRing.initialPosition = { x: 0, y: -25, z: 0 };
    exhaustRing.position.y = exhaustRing.initialPosition.y;
    scene.add(exhaustRing);
    engineParts.exhaustRing = exhaustRing;

    // 8.TVC ACTUATOR USING CYNLIDER MESH

    const outerRadius = 0.2; // thickness of pipe
    const innerRadius = 9; // optional (for hollow pipe)
    const height = 10; // length of the rod
    const radialSegments = 32; // smoothness

    // If you want it hollow, use TubeGeometry or subtract later; for now solid rod:
    const geometry = new THREE.CylinderGeometry(outerRadius, outerRadius, height, radialSegments);

    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.5,
        roughness: 0.3,
    });

    const tvcRod = new THREE.Mesh(geometry, material);

    // Orient it properly (default cylinder points up along Y)
    tvcRod.rotation.z = Math.PI / -3.2; // make it horizontal if needed
    tvcRod.position.set(4.5, 1, 2);

    scene.add(tvcRod);
    engineParts.tvcRod = tvcRod;

    // 8. Custom TVC Actuator pipe
    // const actuatorRod = new THREE.BufferGeometry();
    // const vertices = new Float32Array([
    //     0, 0, 0, // vertex 0: top
    //     1, 1, 1, // vertex 1: bottom left
    //     1.0, -1.0, 0.0, // vertex 2: bottom right
    //     1.0, 2.65, 1.3, // which direction is this?
    // ]);
    // const indices = new Uint32Array([1,2,3]); // Single triangle face
    // actuatorRod.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // actuatorRod.setIndex(new THREE.BufferAttribute(indices, 1));
    // actuatorRod.computeVertexNormals();
    // const tvcMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
    // const tvcRod = new THREE.Mesh(actuatorRod, tvcMaterial);
    // tvcRod.position.set(4, 12, 0);
    // tvcRod.initialPosition = { x: 4.5, y: 1, z: 0 };
    // tvcRod.position.set(tvcRod.initialPosition.x, tvcRod.initialPosition.y, tvcRod.initialPosition.z);
    // scene.add(tvcRod);
    // engineParts.tvcRod = tvcRod;



    // Create container group for whole engine (for rotation control)
    engineParts.group = new THREE.Group();
    Object.values(engineParts).forEach(part => {
        if (part !== engineParts.group) {
            // Will manually control instead of grouping
        }
    });
}

// ===================================
// SCROLL EVENT HANDLER
// ===================================
function onScroll() {
    // Calculate scroll progress (0 to 1)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

    animationState.scrollProgress = progress;

    // Update progress bar
    progressFill.style.width = `${progress * 100}%`;
    stagePercent.textContent = `${Math.round(progress * 100)}%`;

    // Update stage labels based on scroll position
    updateStageLabels(progress);

    // Update stage content visibility
    updateStageContentVisibility();
}

// ===================================
// UPDATE STAGE LABELS
// ===================================
const stageNames = [
    'INITIALIZING',
    'APPROACH SEQUENCE',
    'COMPONENT ASSEMBLY',
    'CORE IGNITION',
    'FINAL ASSEMBLY',
    'RAPTOR 1 ONLINE'
];

function updateStageLabels(progress) {
    let stage = 0;
    if (progress < 0.2) stage = 1;
    else if (progress < 0.4) stage = 2;
    else if (progress < 0.6) stage = 3;
    else if (progress < 0.8) stage = 4;
    else stage = 5;

    if (stage !== animationState.currentStage) {
        animationState.currentStage = stage;
        stageLabel.textContent = stageNames[stage];
    }
}

// ===================================
// UPDATE STAGE CONTENT VISIBILITY
// ===================================
function updateStageContentVisibility() {
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const content = section.querySelector('.stage-content');

        // Show content when section is in middle of viewport
        if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// ===================================
// ANIMATION LOOP
// ===================================
function animate() {
    requestAnimationFrame(animate);

    const progress = animationState.scrollProgress;

    // Apply smooth easing function (easeInOutCubic)
    const eased = easeInOutCubic(progress);

    // Reset camera and parts to initial state if at top
    if (progress === 0) {
        camera.position.set(0, 2, 25);
        camera.lookAt(0, 0, 0);

        // Reset all parts to initial positions
        engineParts.baseRing.position.x = -20;
        engineParts.baseRing.rotation.y = 0;
        engineParts.chamber.position.y = 15;
        engineParts.turbopump.position.x = 20;
        engineParts.turbopump.rotation.y = 0;
        engineParts.pipe1.position.x = -15;
        engineParts.pipe2.position.x = -15;
        engineParts.nozzle.position.y = -20;
        engineParts.exhaustRing.position.y = -25;
        engineParts.core.material.emissiveIntensity = 0;
        engineParts.core.scale.set(1, 1, 1);

        const coreLight = scene.getObjectByName('coreLight');
        if (coreLight) {
            coreLight.intensity = 0;
        }
    }

    // ===== STAGE 1: CAMERA APPROACH (0% - 20%) =====
    if (progress < 0.2) {
        const stageProgress = progress / 0.2; // 0 to 1 within stage
        const easeStage = easeInOutCubic(stageProgress);

        // Camera moves from far to closer position
        camera.position.z = 25 - (easeStage * 10); // 25 → 15
        camera.position.y = 2 + (easeStage * 1); // 2 → 3

        // Base ring spins in from left
        engineParts.baseRing.position.x = lerp(-20, 0, easeStage);
        engineParts.baseRing.rotation.y = easeStage * Math.PI * 2;
    }

    // ===== STAGE 2: COMPONENT ASSEMBLY (20% - 40%) =====
    if (progress >= 0.2 && progress < 0.4) {
        const stageProgress = (progress - 0.2) / 0.2;
        const easeStage = easeInOutCubic(stageProgress);

        // Chamber descends from above
        engineParts.chamber.position.y = lerp(15, 1, easeStage);

        // Turbopump slides in from right
        engineParts.turbopump.position.x = lerp(20, 3.5, easeStage);
        engineParts.turbopump.rotation.y = easeStage * Math.PI;

        // Pipes connect from left
        engineParts.pipe1.position.x = lerp(-15, -2.5, easeStage);
        engineParts.pipe2.position.x = lerp(-15, -2.5, easeStage);

        // Nozzle rises from below
        engineParts.nozzle.position.y = lerp(-20, -4, easeStage);
        engineParts.exhaustRing.position.y = lerp(-25, -6, easeStage);
    }

    // ===== STAGE 3: CORE IGNITION (40% - 60%) =====
    if (progress >= 0.4 && progress < 0.6) {
        const stageProgress = (progress - 0.4) / 0.2;
        const easeStage = easeInOutCubic(stageProgress);

        // Core glows with increasing intensity
        engineParts.core.material.emissiveIntensity = easeStage * 2;

        // Core light intensifies
        const coreLight = scene.getObjectByName('coreLight');
        if (coreLight) {
            coreLight.intensity = easeStage * 3;
            coreLight.distance = 10 + (easeStage * 20);
        }

        // Slight pulsing scale on core
        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.05 * easeStage;
        engineParts.core.scale.set(pulse, pulse, pulse);

        // Camera moves slightly closer
        camera.position.z = 15 - (easeStage * 2); // 15 → 13
    }

    // ===== STAGE 4: FINAL ASSEMBLY & ROTATION (60% - 80%) =====
    if (progress >= 0.6 && progress < 0.8) {
        const stageProgress = (progress - 0.6) / 0.2;
        const easeStage = easeInOutCubic(stageProgress);

        // Entire engine rotates slowly for full reveal
        const rotationY = easeStage * Math.PI * 2; // Full 360° rotation

        Object.keys(engineParts).forEach(key => {
            if (key !== 'group' && engineParts[key]) {
                const part = engineParts[key];
                // Rotate around center point
                const radius = Math.sqrt(part.position.x ** 2 + part.position.z ** 2);
                const angle = Math.atan2(part.position.z, part.position.x);
                part.position.x = Math.cos(angle + rotationY) * radius;
                part.position.z = Math.sin(angle + rotationY) * radius;
                part.rotation.y += 0.002; // Individual spin
            }
        });

        // Camera orbits slightly
        const orbitAngle = easeStage * Math.PI * 0.5;
        camera.position.x = Math.sin(orbitAngle) * 5;
        camera.position.z = 13 + Math.cos(orbitAngle) * 5;
        camera.lookAt(0, 0, 0);
    }

    // ===== STAGE 5: RAPTOR 1 ONLINE (80% - 100%) =====
    if (progress >= 0.8) {
        const stageProgress = (progress - 0.8) / 0.2;
        const easeStage = easeInOutCubic(stageProgress);

        // Camera pulls back for dramatic reveal
        camera.position.z = 15 + (easeStage * 7); // 13 → 20
        camera.position.y = -5 + (easeStage * 2); // 3 → 5
        camera.lookAt(0, 0, 0);

        // Full glow maintained
        engineParts.core.material.emissiveIntensity = 2 + Math.sin(Date.now() * 0.002) * 0.5;

        // Gentle continuous rotation
        Object.keys(engineParts).forEach(key => {
            if (key !== 'group' && engineParts[key]) {
                engineParts[key].rotation.y += 0.001;
            }
        });
    }

    // Render the scene
    renderer.render(scene, camera);
}

// ===================================
// EASING FUNCTION
// ===================================
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ===================================
// LINEAR INTERPOLATION
// ===================================
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// ===================================
// WINDOW RESIZE HANDLER
// ===================================
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// SIMULATE LOADING
// ===================================
function simulateLoading() {
    // Immediately hide loading screen
    loadingOverlay.classList.add('hidden');
}

// ===================================
// INITIALIZE ON DOM LOAD
// ===================================
// Ensure scroll is at top before page fully loads
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('DOMContentLoaded', init);

/* ========================================================================
   SCROLL MAPPING TABLE (for reference)
   ========================================================================
   
   Scroll %     Stage    Event Description
   --------     -----    -------------------------------------------------
   0% - 20%     1        Camera approaches from distance (z: 25→15)
                         Base ring spins in from left
                         
   20% - 40%    2        Chamber descends from above
                         Turbopump slides in from right
                         Pipes connect from left
                         Nozzle rises from below
                         
   40% - 60%    3        Core ignites with emissive glow
                         Core light intensifies
                         Pulsing effect on core
                         Camera moves closer (z: 15→13)
                         
   60% - 80%    4        Full engine 360° rotation reveal
                         Camera orbits around engine
                         Individual part spins
                         
   80% - 100%   5        Camera pulls back (z: 13→20, y: 3→5)
                         Raptor 1 fully assembled
                         Continuous gentle rotation
                         Glow pulse effect maintained
   
   ======================================================================== */
