
'use strict';
import THREE from 'three';
import CubeFactory from './CubeFactory';

const colorItemsGrayed = [
  [0.35, 0.4, 0.42], //left
  [0.44, 0.47, 0.5], //top
  [0.44, 0.5, 0.51] //front
];


export default class HostFactory extends CubeFactory {
  constructor({scene}) {
    super({scene});

    this.colorHosts = this.colorHosts.bind(this);
    this.hostsGrayed = false;
  }

  grayAllHosts(colorThem) {
    if(colorThem && !this.hostsGrayed) {
      this.hostsGrayed = true;
      this.colorHosts();
    } else if(!colorThem && this.hostsGrayed) {
      this.hostsGrayed = false;
      this.colorHosts();
    }
  }

  colorHosts() {
    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const colorsPerCube =
      this.numDifferentColors *
      this.numVerticesPerFace;
    const colors = new Float32Array(
      numCubes *
      colorsPerCube *
      this.numElementPerVertex
    );

    let colorIndex = 0;
    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      const colorItems = this.getColorArrayForFragment(fragment);
      for (let i2 = 0; i2 < this.numDifferentColors; i2++) {
        for (let i3 = 0; i3 < this.numVerticesPerFace; i3++) {
          colors[colorIndex++] = colorItems[i2][0];
          colors[colorIndex++] = colorItems[i2][1];
          colors[colorIndex++] = colorItems[i2][2];
        }
      }
    }

    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, 3));

    this.globalGeometry.attributes.color.needsUpdate = true;
  }

  getColorArrayForFragment(fragment) {
    //if all hosts are grayed of the health is undefined
    if(this.hostsGrayed || !fragment.health) {
      return colorItemsGrayed;
    } else {
      return super.getColorArrayForFragment(fragment);
    }
  }
}
