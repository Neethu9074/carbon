import * as ro from 'reactive-observables';
import THREE from 'three';

import BackgroundScene from 'in-components/graphView/components/BackgroundScene';
import GraphScene from 'in-components/graphView/components/GraphScene';
import Graph from 'in-components/graphView/entities/Graph';


export default function createUniverseRenderer({container, canvas}) {
  const changeSignal = true;
  const changes = ro.create();
  const renderSubscription = changes
    .debounce(1000)
    .subscribe(update);

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClear = false;

  const backgroundScene = new BackgroundScene();
  const graphScene = new GraphScene(renderer);
  const graph = new Graph();

  const resizeSubscription = ro.on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();
  realtimeUpdate();

  return {
    canvas,
    dispose
  };

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.height = height;
    canvas.width = width;

    renderer.setSize(width, height);
    graphScene.resize(width, height);

    changes.emit(changeSignal);
  }

  function realtimeUpdate() {
    requestAnimationFrame(realtimeUpdate);

    graphScene.realtimeUpdate();

    backgroundScene.render(renderer);
    graphScene.render(renderer);
  }

  function update() {
    graphScene.update(graph);

    changes.emit(changeSignal);
  }

  function dispose() {
    resizeSubscription.dispose();
    renderSubscription.dispose();
    backgroundScene.dispose();
    graphScene.dispose();
    graph.dispose();
  }
}
