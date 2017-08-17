import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, DirectionalLight } from 'in-map/3DLibProvider';

export default function createScene(canvas, webGlContext) {
  let camera, scene, renderer;
  init();
  update();

  return {
    dispose
  };

  function init() {
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

  function update() {
    requestAnimationFrame(update);

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function dispose() {}
}
