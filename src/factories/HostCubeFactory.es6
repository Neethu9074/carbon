
'use strict';
import THREE from 'three';
import MeshFactory from './MeshFactory';

const colorItemsGrayed = [
  [0.2, 0.2, 0.2], //front
  [0.4, 0.4, 0.4], //top
  [0.3, 0.3, 0.3] //left
];

const colorItemsOk = [
  [0.184, 0.64, 0.71], //front
  [0.212, 0.71, 0.745], //top
  [0.204, 0.694, 0.75] //left
];

const colorItemsWarning = [
  [0.89, 0.73, 0.02], //front
  [0.89, 0.824, 0.078], //top
  [0.89, 0.827, 0.14] //left
];

const colorItemsDanger = [
  [0.878, 0.145, 0], //front
  [0.878, 0.31, 0], //top
  [0.878, 0.262, 0] //left
];


export default class HostCubeFactory extends MeshFactory {
  constructor({scene}) {
    super({scene});

    this.vertexPos = [
      //front
      [-0.5, 0, 0.5],
      [0.5, 0, 0.5],
      [0.5, 1, 0.5],

      [-0.5, 0, 0.5],
      [0.5, 1, 0.5],
      [-0.5, 1, 0.5],

      //top
      [-0.5, 1, 0.5],
      [0.5, 1, 0.5],
      [0.5, 1, -0.5],

      [-0.5, 1, 0.5],
      [0.5, 1, -0.5],
      [-0.5, 1, -0.5],

      //left
      [-0.5, 0, -0.5],
      [-0.5, 0, 0.5],
      [-0.5, 1, -0.5],

      [-0.5, 0, 0.5],
      [-0.5, 1, 0.5],
      [-0.5, 1, -0.5]
    ];

    //overwrite the default material
    this.material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending
    });

    this.numDifferentColors = 3;

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
    if(this.hostsGrayed) {
      return colorItemsGrayed;
    }

    const health = fragment.health;

    if(health === 'warning') {
      return colorItemsWarning;
    } else if(health === 'danger') {
      return colorItemsDanger;
    }
    return colorItemsOk;
  }
}
