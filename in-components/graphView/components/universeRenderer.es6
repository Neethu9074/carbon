import * as ro from 'reactive-observables';
import THREE from 'three';

import BackgroundScene from 'in-components/graphView/components/BackgroundScene';
import GraphScene from 'in-components/graphView/components/GraphScene';
import Graph from 'in-components/graphView/entities/Graph';

export default function createUniverseRenderer({container, canvas}) {
  const changeSignal = true;
  const changes = ro.create();
  const renderSubscription = changes
    .throttle(1000)
    .subscribe(render);

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClear = false;

  const backgroundScene = new BackgroundScene();
  const graphScene = new GraphScene();
  const graph = new Graph();

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
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.height = height;
    canvas.width = width;

    renderer.setSize(width, height);
    graphScene.resize(width, height);

    changes.emit(changeSignal);
  }

  function render() {
    graphScene.update(graph);

    backgroundScene.render(renderer);
    graphScene.render(renderer);

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
