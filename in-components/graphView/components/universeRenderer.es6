import * as ro from 'reactive-observables';
import THREE from 'three';

import BackgroundScene from 'in-components/graphView/components/BackgroundScene';
import Graph from 'in-components/graphView/entities/Graph';

export default function createUniverseRenderer({container, canvas}) {
  let height;
  let width;

  const changeSignal = true;
  const changes = ro.create();
  const renderSubscription = changes
    .debounce(300)
    .subscribe(render);

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoUpdateObjects = false; // objects organize matrix update by themselves
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
  scene.add(camera);

  const backgroundScene = new BackgroundScene();

  const resizeSubscription = ro.on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();

  const graph = new Graph();

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
    backgroundScene.render(renderer);
    renderer.render(scene, camera);
  }

  function dispose() {
    resizeSubscription.dispose();
    renderSubscription.dispose();
    graph.dispose();
  }
}
