import {view} from 'in-services/stores/view';

import VisualMap from './VisualMap';


export default class MapHandler {

  constructor({ scene }) {
    this.viewSubscription = view.subscribe(v => {
      this.view = v;
      if (this.map) {
        this.map.dispose();
      }
      this.map = new VisualMap({ parent: scene });
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
