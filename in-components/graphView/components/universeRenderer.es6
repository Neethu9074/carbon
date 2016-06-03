import * as ro from 'reactive-observables';
import THREE from 'three';


export default function createUniverseRenderer({container, canvas}) {
  let height;
  let width;

  const changeSignal = true;
  const changes = ro.create();
  const renderSubscription = changes
    .debounce(300)
    .subscribe(render);

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setClearColor(new THREE.Color(0xff0000));
  // objects organize matrix update by themselves
  renderer.autoUpdateObjects = false;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
  scene.add(camera);

  const resizeSubscription = ro.on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();

  return {
    canvas,
    dispose
  };

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;

    canvas.height = height;
    canvas.width = width;

    renderer.setSize(width, height);
    camera.aspect = width / height;

    changes.emit(changeSignal);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function dispose() {
    resizeSubscription.dispose();
    renderSubscription.dispose();
  }
}
