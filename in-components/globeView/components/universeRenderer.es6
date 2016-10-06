import {create, on} from 'reactive-observables';

import GraphScene from 'in-components/globeView/components/GraphScene';
import {WebGLRenderer, Color} from 'in-map/3DLibProvider';


export default function createUniverseRenderer({container, canvas}) {
  let isRunning = true;
  const changeSignal = true;
  const changes = create();
  const updateSubscription = changes
    .debounce(1000)
    .subscribe(update);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.autoClear = true;
  renderer.setClearColor(new Color(0x222222), 1.0);

  const graphScene = new GraphScene(renderer);

  const resizeSubscription = on(window, 'resize')
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
    if (isRunning) {
      requestAnimationFrame(realtimeUpdate);
    }

    graphScene.realtimeUpdate();
    graphScene.render(renderer);
  }

  function update() {
    changes.emit(changeSignal);
  }

  function dispose() {
    isRunning = false;

    resizeSubscription.dispose();
    updateSubscription.dispose();
    graphScene.dispose();
  }
}
