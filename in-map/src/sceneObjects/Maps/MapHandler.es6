import {view} from 'in-services/stores/view';
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

  getCurrentZoomLevel() {
    let zoomLevel = 250;
    this.doIfPresent((map) => zoomLevel = map.controller.zoomLevel);
    return zoomLevel;
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
