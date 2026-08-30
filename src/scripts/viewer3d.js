/**
 * The 3D & Spatial viewers.
 *
 * three.js is loaded on demand rather than imported at the top, because this
 * section is off (SHOW_3D_SECTION) and an unconditional import would ship the
 * whole library — and its four loaders — to every visitor for a section that
 * renders nothing. The original pulled these from a CDN importmap; they now
 * come from the dependency, so the site has no third-party runtime.
 */

let three = null;

async function loadThree() {
    if (three) return three;
    const [THREE, controls, obj, ply, fbx] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('three/examples/jsm/loaders/OBJLoader.js'),
        import('three/examples/jsm/loaders/PLYLoader.js'),
        import('three/examples/jsm/loaders/FBXLoader.js'),
    ]);
    three = {
        THREE,
        OrbitControls: controls.OrbitControls,
        OBJLoader: obj.OBJLoader,
        PLYLoader: ply.PLYLoader,
        FBXLoader: fbx.FBXLoader,
    };
    return three;
}

const viewers = {};
const resizeFns = {};
let lazyObserver = null;

function getThemeBg() {
    const s = getComputedStyle(document.body);
    return s.getPropertyValue('--contact-bg').trim() || '#111';
}

async function createViewer(idx, modelInfo) {
    const container = document.getElementById('viewer-' + idx);
    if (!container || viewers[idx]) return; // already created
    const loading = container.querySelector('.viewer-loading');
    if (loading) loading.textContent = 'Loading 3D...';

    // Claim the slot before the await, or a second intersection callback for
    // the same tile starts a duplicate viewer while this one is still loading.
    viewers[idx] = { pending: true };

    const { THREE, OrbitControls, OBJLoader, PLYLoader, FBXLoader } = await loadThree();

    const canvas = document.createElement('canvas');
    container.insertBefore(canvas, container.firstChild);

    const w = container.clientWidth || 400, h = container.clientHeight || 340;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(getThemeBg()));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.01, 5000);
    camera.position.set(0, 0, 5);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 500;

    // Scroll zoom only when hovering
    container.addEventListener('mouseenter', () => { controls.enableZoom = true; });
    container.addEventListener('mouseleave', () => { controls.enableZoom = false; });

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 10, 7); scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dir2.position.set(-5, -5, -5); scene.add(dir2);

    // Load model
    const ext = modelInfo.file.split('.').pop().toLowerCase();
    let loader;
    if (ext === 'obj') loader = new OBJLoader();
    else if (ext === 'ply') loader = new PLYLoader();
    else if (ext === 'fbx') loader = new FBXLoader();
    else { delete viewers[idx]; return; }

    loader.load(modelInfo.file, function (result) {
        let obj;
        if (ext === 'ply') {
            const geo = result;
            const hasColor = geo.hasAttribute('color');
            const vertexCount = geo.attributes.position ? geo.attributes.position.count : 0;

            // Detect if this is a dense point cloud (no face indices or very high vertex count)
            const isPointCloud = (!geo.index && vertexCount > 50000) || vertexCount > 500000;

            if (isPointCloud) {
                // Render as point cloud
                const mat = new THREE.PointsMaterial({
                    size: 0.01,
                    sizeAttenuation: true,
                    vertexColors: hasColor,
                    color: hasColor ? 0xffffff : 0xcccccc
                });
                obj = new THREE.Points(geo, mat);
            } else {
                // Render as mesh
                geo.computeVertexNormals();
                const mat = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    flatShading: false,
                    vertexColors: hasColor
                });
                obj = new THREE.Mesh(geo, mat);
            }
        } else {
            obj = result;
        }
        scene.add(obj);

        // Center and fit to view
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        obj.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;

        // Adjust point size for point clouds based on model scale
        if (obj.isPoints) {
            obj.material.size = maxDim * 0.003;
        }

        camera.position.set(0, maxDim * 0.5, maxDim * 1.8);
        camera.far = maxDim * 20;
        camera.updateProjectionMatrix();
        controls.target.set(0, 0, 0);
        controls.minDistance = maxDim * 0.3;
        controls.maxDistance = maxDim * 6;
        controls.update();

        if (loading) loading.style.display = 'none';
    },
        function (progress) {
            // Progress callback
            if (loading && progress.total) {
                const pct = Math.round((progress.loaded / progress.total) * 100);
                loading.textContent = 'Loading... ' + pct + '%';
            }
        },
        function (err) {
            console.error('3D load error for', modelInfo.file, err);
            if (loading) loading.textContent = 'Failed to load';
        });

    // Resize handler
    function onResize() {
        const w2 = container.clientWidth, h2 = container.clientHeight;
        if (w2 === 0 || h2 === 0) return;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
    }
    resizeFns[idx] = onResize;

    // Animate
    let active = true;
    function animate() {
        if (!active) return;
        requestAnimationFrame(animate);
        controls.update();
        renderer.setClearColor(new THREE.Color(getThemeBg()));
        renderer.render(scene, camera);
    }
    animate();

    viewers[idx] = { renderer, scene, camera, controls, destroy: () => { active = false; renderer.dispose(); } };
}

// Lazy loading: only create viewer when scrolled into view
window.initLazyViewers = function () {
    // Disconnect old observer
    if (lazyObserver) lazyObserver.disconnect();

    const models = window.MODELS_3D || [];
    if (models.length === 0) return;

    lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.dataset.modelIdx);
                if (!isNaN(idx) && models[idx] && !viewers[idx]) {
                    createViewer(idx, models[idx]);
                }
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' }); // start loading 200px before visible

    document.querySelectorAll('.viewer-item[data-model-idx]').forEach(el => {
        lazyObserver.observe(el);
    });
};

// Legacy fallback
window.initViewers = window.initLazyViewers;

window._viewerResize = function (idx) {
    setTimeout(() => { if (resizeFns[idx]) resizeFns[idx](); }, 550);
};

window.addEventListener('resize', () => {
    Object.values(resizeFns).forEach(fn => { if (fn) fn(); });
});
