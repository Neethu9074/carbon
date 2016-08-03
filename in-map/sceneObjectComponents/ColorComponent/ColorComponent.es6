import THREE from 'three';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {theme} from 'in-services/theme';


export default class ColorComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_color');

    this.color = new THREE.Color(0xffffff);
    this.emitToClient('colorChanged', this.color);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(this.sceneObject.eventEmitter.on('healthChanged').subscribe(health => {
      const severity = health.get('maxSeverity', 0);
      this.setColor(hexToRGBNormalized(theme.health[Math.floor(severity)]));
    }));
  }

  setRGB(r, g, b) {
    if (this.color.x === r &&
        this.color.y === g &&
        this.color.z === b) {
      return;
    }

    this.color.setRGB(r, g, b);
    this.emitToClient('colorChanged', this.color);
  }

  setColor(color) {
    this.setRGB(color.r, color.g, color.b);
  }

  getColor() {
    return this.color;
  }

  dispose() {
    super.dispose();

    this.color = null;
  }
}
