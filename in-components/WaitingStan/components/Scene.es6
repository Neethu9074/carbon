import {
  Animation,
  DirectionalLight,
  LoadingManager,
  PerspectiveCamera,
  Scene,
  SkinnedMesh,
  Texture,
  Vector3,
  WebGLRenderer
} from 'in-map/3DLibProvider';
import stanTexturePath from 'in-components/WaitingStan/components/assets/stanColorMap.jpg';
import stanModelPath from 'in-components/WaitingStan/components/assets/stanMesh.dae';
import { loadImage } from 'in-map/services/imageLoader';
import ColladaLoader from 'in-map/lib/ColladaLoader';

export default function createScene(canvas, webGlContext) {
  let camera,
    scene,
    renderer,
    stan = {},
    isDisposed = false;

  initScene();
  loadStan();
  update();
  console.log(scene);

  return {
    dispose
  };

  function initScene() {
    camera = new PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(0, 0, 9);
    camera.lookAt(new Vector3(0, 0, 0));

    scene = new Scene();

    renderer = new WebGLRenderer({
      canvas: canvas,
      context: webGlContext,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x555555);

    const directionalLight = new DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(0.2, 0.2, 1);
    scene.add(directionalLight);
  }

  function loadStan() {
    const texture = loadImage(stanTexturePath, stanTexture => {
      texture.image = stanTexture;
      texture.needsUpdate = true;
    });

    // Prepare ColladaLoader
    var daeLoader = new ColladaLoader();
    daeLoader.options.convertUpAxis = true;
    daeLoader.load(stanModelPath, function(collada) {
      var modelMesh = collada.scene;

      // Prepare and play animation
      modelMesh.traverse(function(child) {
        if (child.material) {
          child.material.map = texture;
          child.material.color.set(0xffffff);
          child.material.emissive.set(0x111111);
        }
        if (child instanceof SkinnedMesh) {
          setupAnimations(child);
        }
      });

      // Set position and scale
      modelMesh.position.set(0, -1.5, 0);
      var scale = 1;
      modelMesh.scale.set(scale, scale, scale);

      // Add the mesh into scene
      scene.add(modelMesh);

      stan.mesh = modelMesh;
    });
  }

  function setupAnimations(skinnedMesh) {
    var allAnimations = new Animation(skinnedMesh, skinnedMesh.geometry.animation);
    allAnimations.loop = true;
    allAnimations.data.fps = 25;

    stan.animations.fly = {
      from: 0,
      length: 3.33333333,
      animation: allAnimations
    };
    stan.animations.no = {
      from: 3.33333333,
      length: 0.833333333,
      animation: allAnimations
    };
  }

  function update() {
    // break the update loop
    if (isDisposed) {
      return;
    }

    requestAnimationFrame(update);

    // animation stuff

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function dispose() {
    isDisposed = true;
  }
}
