'use strict';

import THREE from 'three';


const colorService = new THREE.Color(0, 0, 0);

export default class ColorGenerator {
  constructor(seed) {
    this.seed = seed;
    this.progress = 0;
    this.stepsPerGenerate = 1 / (seed - 1);

    this.setHueRange(25, 360);
    this.setSatRange(85, 100);
    this.setLumRange(70, 90);
  }

  setHueRange(min, max) {
    this.minHue = Math.max(0, min);
    this.maxHue = Math.min(max, 360);
  }

  setSatRange(min, max) {
    this.minSat = Math.max(0, min);
    this.maxSat = Math.min(max, 100);
  }

  setLumRange(min, max) {
    this.minLum = Math.max(0, min);
    this.maxLum = Math.min(max, 100);
  }

  getNextColor() {
    const h = this.minHue + ((this.maxHue - this.minHue) * this.progress);
    const s = this.minSat + ((this.maxSat - this.minSat) * this.progress);
    const l = this.minLum + ((this.maxLum - this.minLum) * this.progress);

    colorService.setHSL(h / 360, s / 100, l / 100);
    const hex = '#' + colorService.getHexString();
    const color = {
      h, s, l,
      hex
    };

    this.progress += this.stepsPerGenerate;
    if(this.progress > 1) {
      this.progress = 0;
    }

    return color;
  }
}
