import {view} from 'in-stores/view';
import views from 'in-services/views';

import PhysicalMap from './PhysicalMap';
import ProcessMap from './ProcessMap';


export default class MapHandler {

  constructor({ scene }) {
    this.viewSubscription = view.subscribe(v => {
      this.doIfPresent((map) => map.dispose());

      if (v === views.physical) {
        this.map = new PhysicalMap({ parent: scene });
      } else if (v === views.process) {
        this.map = new ProcessMap({ parent: scene });
      }
    });
  }

  switchToAscii() {
    this.doIfPresent((map) => map.switchToAscii());
  }

  update() {
    this.doIfPresent((map) => map.update());
  }

  updateCamera() {
    this.doIfPresent((map) => map.camera.update());
  }

  onWindowResize(width, height) {
    this.doIfPresent((map) => {
      map.camera.setSize(width, height);
      map.camera.setCameraFromSize();
    });
  }

  getCurrentZoomLevel() {
    let zoomLevel = 250;
    this.doIfPresent((map) => zoomLevel = map.controller.zoomLevel);
    return zoomLevel;
  }

  getCurrentCamera() {
    let camera;
    this.doIfPresent((map) => {
      const cam = map.camera;
      if (cam) {
        camera = cam.camera;
      }
    });
    return camera;
  }

  onZoom() {
    this.doIfPresent((map) => map.onZoom());
  }

  doIfPresent(action) {
    if (this.map) {
      action(this.map);
    }
  }

  dispose() {
    this.viewSubscription.dispose();
    this.viewSubscription = null;

    this.doIfPresent((map) => map.dispose());
    this.map = null;
  }
}
