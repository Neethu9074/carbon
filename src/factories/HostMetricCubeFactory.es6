
'use strict';
import THREE from 'three';
import MeshFactory from './MeshFactory';

//import shader
import fragmentShader from './hostMetricFragmentShader.glsl';
import vertexShader from './hostMetricVertexShader.glsl';

const colorItemsOk = [
  [0.184, 0.64, 0.71], //front
  [0.212, 0.71, 0.745], //top
  [0.204, 0.694, 0.75] //left
];


export default class HostMetricCubeFactory extends MeshFactory {
  constructor({scene}) {
    super({scene});

    this.vertexPos = [
      //front
      [-0.4, 0, 0.4],
      [0.4, 0, 0.4],
      [0.4, 1, 0.4],

      [-0.4, 0, 0.4],
      [0.4, 1, 0.4],
      [-0.4, 1, 0.4],

      //top
      [-0.4, 1, 0.4],
      [0.4, 1, 0.4],
      [0.4, 1, -0.4],

      [-0.4, 1, 0.4],
      [0.4, 1, -0.4],
      [-0.4, 1, -0.4],

      //left
      [-0.4, 0, -0.4],
      [-0.4, 0, 0.4],
      [-0.4, 1, -0.4],

      [-0.4, 0, 0.4],
      [-0.4, 1, 0.4],
      [-0.4, 1, -0.4]
    ];

    //overwrite the default material
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      vertexColors: THREE.VertexColors
    });

    this.numDifferentColors = 3;
  }

  getColorArrayForFragment() {
    return colorItemsOk;
  }

  updateHeights() {
    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const uvs = new Float32Array(numCubes * this.vertexPos.length * 2);
    for (let i = 0; i < numCubes; i++) {
      const offset = i * this.vertexPos.length * 2;
      this.fillUvs({uvs, offset});
    }

    this.globalGeometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  }

  fillUvs({uvs, offset}) {
    const height = Math.random() * 4.0;

    //copy positions into global array
    for (let iVertex = 0; iVertex < this.vertexPos.length; iVertex++) {
      const index = iVertex * 2 + offset;
      if(this.vertexPos[iVertex][1] > 0) {
        //use u field to store the height of the cube
        uvs[index + 0] = height;
      }
    }
  }
}
