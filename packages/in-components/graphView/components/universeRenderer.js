import { create } from '@instana/observables';

import BackgroundScene from 'in-components/graphView/components/BackgroundScene';
import GraphScene from 'in-components/graphView/components/GraphScene';
import Graph from 'in-components/graphView/entities/Graph';
import { update as updateTime } from 'in-map/misc/time';
import { debouncedResize$ } from 'in-services/browser';
import { WebGLRenderer } from 'in-map/3DLibProvider';

export default function createUniverseRenderer({ container, canvas }) {
  let isRunning = true;
  const changeSignal = true;
  const changes = create();
  const updateSubscription = changes.debounce(1000).subscribe(update);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.autoClear = false;

  const backgroundScene = new BackgroundScene();
  const graphScene = new GraphScene(renderer);
  const graph = new Graph();

  const resizeSubscription = debouncedResize$.subscribe(resize);

  // initial resize
  resize();
  realtimeUpdate(0);

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

  function realtimeUpdate(highResTimestamp) {
    updateTime(highResTimestamp);
    if (isRunning) {
      requestAnimationFrame(realtimeUpdate);
    }

    graphScene.realtimeUpdate();

    backgroundScene.render(renderer);
    graphScene.render(renderer);
  }

  function update() {
    graphScene.updateGeometry(graph);

    changes.emit(changeSignal);
  }

  function dispose() {
    isRunning = false;

    resizeSubscription.dispose();
    updateSubscription.dispose();
    backgroundScene.dispose();
    graphScene.dispose();
    graph.dispose();
  }
}
