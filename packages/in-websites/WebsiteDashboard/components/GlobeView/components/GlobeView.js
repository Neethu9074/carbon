import { create } from '@instana/observables';

import BackgroundScene from 'in-websites/WebsiteDashboard/components/GlobeView/components/BackgroundScene';
import GlobeScene from 'in-websites/WebsiteDashboard/components/GlobeView/components/GlobeScene';
import Overlays from 'in-websites/WebsiteDashboard/components/GlobeView/components/Overlays';
import { update as updateTime } from 'in-map/misc/time';
import { debouncedResize$ } from 'in-services/browser';
import { WebGLRenderer } from 'in-map/3DLibProvider';

export default class GlobeView {
  constructor({ container, overlay, canvas, getData$, getValue }) {
    updateTime(0);

    this.container = container;
    this.canvas = canvas;

    this.isRunning = true;

    this.changes = create();
    this.updateSubscription = this.changes.debounce(1000).subscribe(this.update.bind(this));

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false
    });
    this.renderer.sortObjects = false;
    this.renderer.autoClear = false;

    this.overlays = new Overlays(this, overlay, getData$, getValue);

    this.backgroundScene = new BackgroundScene();
    this.globeScene = new GlobeScene(this, getData$, getValue, overlay);

    this.resizeSubscription = debouncedResize$.subscribe(this.resize.bind(this));

    // initial resize
    this.resize();

    this.realtimeUpdate(0);
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const backingStoreRatio =
      this.renderer.context.webkitBackingStorePixelRatio ||
      this.renderer.context.mozBackingStorePixelRatio ||
      this.renderer.context.msBackingStorePixelRatio ||
      this.renderer.context.oBackingStorePixelRatio ||
      this.renderer.context.backingStorePixelRatio ||
      1;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const ratio = devicePixelRatio / backingStoreRatio;
    this.canvas.setAttribute('width', width * ratio);
    this.canvas.setAttribute('height', height * ratio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.renderer.setSize(width, height);
    this.backgroundScene.resize(width, height);
    this.globeScene.resize(width, height);
    this.changes.emit(true);
  }

  pinchUp() {
    this.globeScene.pinchUp();
  }

  pinchDown() {
    this.globeScene.pinchDown();
  }

  rotateLeft() {
    this.globeScene.rotateLeft();
  }

  rotateRight() {
    this.globeScene.rotateRight();
  }

  toggleAutoRotate() {
    this.globeScene.toggleAutoRotate();
  }

  toggleHeatMap(enabled) {
    this.globeScene.toggleHeatMap(enabled);
  }

  updateData(props) {
    this.globeScene.updateData(props);
    this.overlays.updateData(props);
  }

  realtimeUpdate(highResTimestamp) {
    if (!this.isRunning) {
      return;
    }

    requestAnimationFrame(ts => this.realtimeUpdate(ts));
    updateTime(highResTimestamp);

    this.globeScene.update();
    this.backgroundScene.render(this.renderer);
    this.globeScene.render(this.renderer);
    this.overlays.update(this.globeScene);
  }

  update() {
    this.changes.emit(true);
  }

  dispose() {
    this.isRunning = false;
    this.resizeSubscription.dispose();
    this.updateSubscription.dispose();
    this.globeScene.dispose();
    this.backgroundScene.dispose();
  }
}
