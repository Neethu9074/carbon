import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  SkinnedMesh,
  Vector3,
  WebGLRenderer,
  AnimationClip,
  AnimationMixer
} from 'in-map/3DLibProvider';
import stanTexturePath from 'in-components/WaitingStan/components/assets/stanColorMap.jpg';
import stanModelPath from 'in-components/WaitingStan/components/assets/stanMesh.dae';
import { loadImage } from 'in-map/services/imageLoader';
import ColladaLoader from 'in-map/lib/ColladaLoader.js';

export default function createScene(canvas, webGlContext) {
  let camera,
    scene,
    renderer,
    stan = {},
    isDisposed = false;

  initScene();
  loadStan();
  update();

  return {
    dispose
  };

  function initScene() {
    const width = 400;
    const height = 300;

    camera = new PerspectiveCamera(27, width / height, 1, 100);
    camera.position.set(0, 0, 9);
    camera.lookAt(new Vector3(0, 0, 0));

    scene = new Scene();

    renderer = new WebGLRenderer({
      canvas: canvas,
      context: webGlContext,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x555555);

    const directionalLight = new DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(0.2, 0.2, 1);
    scene.add(directionalLight);
  }

  function loadStan() {
    const texture = loadImage(stanTexturePath, stanTexture => {
      stanTexture.needsUpdate = true;
    });

    // Prepare ColladaLoader
    var daeLoader = new ColladaLoader();
    daeLoader.options.convertUpAxis = true;
    daeLoader.load(stanModelPath, function(collada) {
      var object = collada.scene;
      const mixer = new AnimationMixer(object);
      object.traverse(function(child) {
        if (child.material) {
          child.material.map = texture;
          child.material.color.set(0xffffff);
          child.material.emissive.set(0x111111);
        }
        if (child instanceof SkinnedMesh) {
          var clip = AnimationClip.parseAnimation(child.geometry.animation, child.geometry.bones);
          mixer.clipAction(clip, child).play();
        }
      });

      // Set position and scale
      object.position.set(0, -1.5, 0);
      var scale = 1;
      object.scale.set(scale, scale, scale);

      scene.add(object);
      stan.mesh = object;
    });
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
