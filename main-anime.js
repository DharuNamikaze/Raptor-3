/* ========================================================================
   RAPTOR 1 - 3D SCROLL ANIMATION (ANIME.JS VERSION)
   Using Anime.js for declarative, keyframe-based animations
   ======================================================================== */

// ===================================
// CORE VARIABLES & SCENE SETUP
// ===================================
let scene, camera, renderer;
let engineParts = {};
let scrollTimeline;

// Canvas and DOM elements
const canvas = document.getElementById('raptor-canvas');
const progressFill = document.getElementById('progress-fill');
const stageInfo = document.getElementById('stage-info');
const stageLabel = stageInfo.querySelector('.stage-label');
const stagePercent = document.getElementById('stage-percent');

// ===================================
// INITIALIZATION
// ===================================
function init() {
    // Force scroll to top
    window.scrollTo(0, 0);
    
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 20, 100);

    // Setup camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 25);
    camera.lookAt(0, 0, 0);

    // Setup renderer
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

    // Create engine parts
    createEngineParts();

    // Setup Anime.js scroll animations
    setupAnimeAnimations();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);

    // Start render loop
    animate();
}

// ===================================
// LIGHTING SETUP
// ===================================
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x4060a0, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0x00d9ff, 0.8, 50);
    rimLight.position.set(-15, 5, 5);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xff6b00, 0, 10);
    coreLight.position.set(0, 0, 0);
    coreLight.name = 'coreLight';
    scene.add(coreLight);
}

// ===================================
// CREATE ENGINE PARTS
// ===================================
function createEngineParts() {
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
        emissiveIntensity: 0
    });

    // Base Ring
    engineParts.baseRing = new THREE.Mesh(
        new THREE.TorusGeometry(3, 0.3, 16, 32),
        metalMaterial
    );
    engineParts.baseRing.position.set(-20, -2, 0);
    engineParts.baseRing.rotation.x = Math.PI / 2;
    scene.add(engineParts.baseRing);

    // Chamber
    engineParts.chamber = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 2.5, 4, 32),
        metalMaterial
    );
    engineParts.chamber.position.set(0, 15, 0);
    scene.add(engineParts.chamber);

    // Turbopump
    engineParts.turbopump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 2, 24),
        metalMaterial
    );
    engineParts.turbopump.position.set(20, 1, 0);
    engineParts.turbopump.rotation.z = Math.PI / 2;
    scene.add(engineParts.turbopump);

    // Pipes
    const pipeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 12);
    engineParts.pipe1 = new THREE.Mesh(pipeGeometry, metalMaterial);
    engineParts.pipe1.position.set(-15, 1, 1);
    engineParts.pipe1.rotation.x = Math.PI / 4;
    scene.add(engineParts.pipe1);

    engineParts.pipe2 = new THREE.Mesh(pipeGeometry.clone(), metalMaterial);
    engineParts.pipe2.position.set(-15, 1, -1);
    engineParts.pipe2.rotation.x = -Math.PI / 4;
    scene.add(engineParts.pipe2);

    // Core
    engineParts.core = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        emissiveMaterial
    );
    engineParts.core.position.set(0, 1, 0);
    scene.add(engineParts.core);

    // Nozzle
    engineParts.nozzle = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 5, 32),
        metalMaterial
    );
    engineParts.nozzle.position.set(0, -20, 0);
    scene.add(engineParts.nozzle);

    // Exhaust Ring
    engineParts.exhaustRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.2, 16, 32),
        metalMaterial
    );
    engineParts.exhaustRing.position.set(0, -25, 0);
    engineParts.exhaustRing.rotation.x = Math.PI / 2;
    scene.add(engineParts.exhaustRing);
}

// ===================================
// SETUP ANIME.JS ANIMATIONS
// ===================================
function setupAnimeAnimations() {
    // Create animation timeline (paused, controlled by scroll)
    scrollTimeline = anime.timeline({
        autoplay: false,
        easing: 'easeInOutCubic'
    });

    // Stage 1: Approach
    scrollTimeline
        .add({
            targets: camera.position,
            z: 15,
            y: 3,
            duration: 1000,
            easing: 'easeInOutQuad'
        }, 0)
        .add({
            targets: engineParts.baseRing.position,
            x: 0,
            duration: 1000,
            easing: 'easeOutCubic'
        }, 0)
        .add({
            targets: engineParts.baseRing.rotation,
            y: Math.PI * 2,
            duration: 1000,
            easing: 'linear'
        }, 0);

    // Stage 2: Assembly
    scrollTimeline
        .add({
            targets: [
                engineParts.chamber.position,
                engineParts.nozzle.position,
                engineParts.exhaustRing.position
            ],
            y: [
                { value: engineParts.chamber.position.y, to: 1 },
                { value: engineParts.nozzle.position.y, to: -4 },
                { value: engineParts.exhaustRing.position.y, to: -6 }
            ],
            duration: 1000,
            easing: 'easeInOutQuad'
        }, 1000)
        .add({
            targets: engineParts.turbopump.position,
            x: 3.5,
            duration: 1000,
            easing: 'easeOutBack'
        }, 1000)
        .add({
            targets: [engineParts.pipe1.position, engineParts.pipe2.position],
            x: -2.5,
            duration: 1000,
            easing: 'easeOutQuad'
        }, 1000);

    // Stage 3: Ignition
    const coreLight = scene.getObjectByName('coreLight');
    scrollTimeline
        .add({
            targets: engineParts.core.material,
            emissiveIntensity: 2,
            duration: 1000,
            easing: 'easeInOutQuad'
        }, 2000)
        .add({
            targets: coreLight,
            intensity: 3,
            distance: 30,
            duration: 1000,
            easing: 'easeInOutQuad'
        }, 2000)
        .add({
            targets: camera.position,
            z: 13,
            duration: 1000,
            easing: 'easeInOutQuad'
        }, 2000);

    // Stage 4: Rotation (simplified - rotate all parts)
    Object.values(engineParts).forEach(part => {
        scrollTimeline.add({
            targets: part.rotation,
            y: `+=${Math.PI * 2}`,
            duration: 1000,
            easing: 'easeInOutQuad'
        }, 3000);
    });

    scrollTimeline.add({
        targets: camera.position,
        x: 5,
        z: 18,
        duration: 1000,
        easing: 'easeInOutQuad',
        update: () => camera.lookAt(0, 0, 0)
    }, 3000);

    // Stage 5: Final reveal
    scrollTimeline.add({
        targets: camera.position,
        x: 0,
        z: 20,
        y: 5,
        duration: 1000,
        easing: 'easeInOutQuad',
        update: () => camera.lookAt(0, 0, 0)
    }, 4000);
}

// ===================================
// SCROLL HANDLER
// ===================================
function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

    // Update progress bar
    progressFill.style.width = `${progress * 100}%`;
    stagePercent.textContent = `${Math.round(progress * 100)}%`;

    // Seek Anime.js timeline based on scroll
    if (scrollTimeline) {
        scrollTimeline.seek(scrollTimeline.duration * progress);
    }

    // Update stage label
    updateStageLabel(progress);

    // Update stage content visibility
    updateStageContent();
}

// ===================================
// UPDATE STAGE LABEL
// ===================================
const stageNames = [
    'APPROACH SEQUENCE',
    'COMPONENT ASSEMBLY',
    'CORE IGNITION',
    'FINAL ASSEMBLY',
    'RAPTOR 1 ONLINE'
];

function updateStageLabel(progress) {
    let stage = Math.floor(progress * 5);
    stage = Math.min(stage, 4);
    stageLabel.textContent = stageNames[stage];
}

// ===================================
// UPDATE STAGE CONTENT
// ===================================
function updateStageContent() {
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const content = section.querySelector('.stage-content');
        
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

    // Subtle glow pulse
    const coreLight = scene.getObjectByName('coreLight');
    if (coreLight && coreLight.intensity > 0) {
        const pulse = Math.sin(Date.now() * 0.002) * 0.3;
        engineParts.core.material.emissiveIntensity = Math.max(0, 2 + pulse);
    }

    renderer.render(scene, camera);
}

// ===================================
// WINDOW RESIZE
// ===================================
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===================================
// INITIALIZE
// ===================================
window.addEventListener('DOMContentLoaded', init);
