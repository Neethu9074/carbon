'use strict';

import THREE from 'three';


const colorService = new THREE.Color(0, 0, 0);

export default class ColorGenerator {
  constructor(seed) {
    this.seed = seed;
    this.progress = 0;
    this.colorIndex = 0;
    this.stepsPerGenerate = 1 / (seed - 1);

    this.setHueRange(25, 360);
    this.setSatRange(85, 100);
    this.setLumRange(70, 90);

    const colors = [];
    for (let i = 0; i < seed; i++) {
      colors.push(this.createColor());
    }
    this.colors = this.shuffle(colors);
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

  shuffle(array) {
    return array;

    // var m = array.length, t, i;
    //
    // // While there remain elements to shuffle…
    // while (m) {
    //   // Pick a remaining element…
    //   i = Math.floor(Math.random() * m--);
    //
    //   // And swap it with the current element.
    //   t = array[m];
    //   array[m] = array[i];
    //   array[i] = t;
    // }
    // return array;
  }

  createColor() {
    const h = this.minHue + ((this.maxHue - this.minHue) * this.progress);
    const s = this.minSat + ((this.maxSat - this.minSat) * this.progress);
    const l = this.minLum + ((this.maxLum - this.minLum) * this.progress);

    this.progress += this.stepsPerGenerate;
    if(this.progress > 1) {
      this.progress = 0;
    }

    colorService.setHSL(h / 360, s / 100, l / 100);
    const hex = '#' + colorService.getHexString();

    return {
      h, s, l,
      hex
    };
  }

  getNextColor() {
    const color = this.colors[this.colorIndex++];

    if(this.colorIndex > this.colors.length - 1) {
      this.colorIndex = 0;
    }

    return color;
  }
}
