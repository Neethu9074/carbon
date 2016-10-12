import {create, on} from 'reactive-observables';

import GlobeScene from 'in-components/globeView/components/GlobeScene';
import {WebGLRenderer, Color} from 'in-map/3DLibProvider';
import {update as updateTime} from 'in-map/misc/time';


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
  renderer.sortObjects = false;
  renderer.autoClear = true;
  renderer.setClearColor(new Color(0x0b0c0d), 1.0);

  const globeScene = new GlobeScene(renderer);

  const resizeSubscription = on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

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
    globeScene.resize(width, height);

    changes.emit(changeSignal);
  }

  function realtimeUpdate(highResTimestamp) {
    updateTime(highResTimestamp);
    if (isRunning) {
      requestAnimationFrame(realtimeUpdate);
    }

    globeScene.update();
    globeScene.render(renderer);
  }

  function update() {
    changes.emit(changeSignal);
  }

  function dispose() {
    isRunning = false;

    resizeSubscription.dispose();
    updateSubscription.dispose();
    globeScene.dispose();
  }
}
