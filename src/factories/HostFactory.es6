
'use strict';
import THREE from 'three';
import CubeFactory from './CubeFactory';
import {theme} from 'instana-ui-services/theme';


const grey = new THREE.Color(theme.map.colors.unknownStatus);
const colorItemsGrayed = [
  [grey.r, grey.g, grey.b], //front
  [grey.r + 0.1, grey.g + 0.1, grey.b + 0.1], //top
  [grey.r + 0.2, grey.g + 0.2, grey.b + 0.2] //left
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
