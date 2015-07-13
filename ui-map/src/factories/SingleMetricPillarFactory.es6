'use strict';

import THREE from 'three';
import TWEEN from 'tween.js';

import MeshFactory from './MeshFactory';
import {theme} from 'instana-ui-services/theme';

//import shader
import fragmentShader from './singleMetricFragmentShader.glsl';
import vertexShader from './singleMetricVertexShader.glsl';


const cyan = new THREE.Color(theme.map.metricColors.cyan);
const colorItemsOk = [
  [cyan.r - 0.1, cyan.g - 0.1, cyan.b - 0.1], //front
  [cyan.r, cyan.g, cyan.b], //top
  [cyan.r + 0.1, cyan.g + 0.1, cyan.b + 0.1] //left
];


export default class SingleMetricPillarFactory extends MeshFactory {

  constructor({scene}) {
    super({scene});

    const progress = {
      type: 'f',
      value: 0.0
    };
    this.setMaterial(new THREE.ShaderMaterial({
      uniforms: {
        progress: progress
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      vertexColors: THREE.VertexColors
    }));

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

    this.numDifferentColors = 3;

    const from = {v: 0.0};
    const to = {v: 1.0};
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onStart(() => scene.startAnimation());
    animation.onComplete(() => scene.stopAnimation());
    animation.onUpdate((v) => progress.value = v);
    this.animation = animation;
  }

  rebuild() {
    super.rebuild();
    this.updateHeights();
  }

  getColorArrayForFragment() {
    return colorItemsOk;
  }

  updateHeights() {
    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const numElementsPerUv = 2; //u&v
    const uvs = new Float32Array(
      numCubes * this.vertexPos.length * numElementsPerUv);

    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      const newHeight = fragment.newHeight;
      const oldHeight = fragment.height === undefined ? 0.0 : fragment.height;
      const offset = i * this.vertexPos.length * numElementsPerUv;

      fragment.height = newHeight;
      this.setHeightToUvs({
        uvs,
        offset,
        newHeight,
        oldHeight,
        scale: fragment.dim.y
      });
    }

    this.globalGeometry.addAttribute('uv',
      new THREE.BufferAttribute(uvs, numElementsPerUv));

    this.animation.stop();
    this.animation.start();
  }

  setHeightToUvs({uvs, offset, newHeight, oldHeight, scale}) {
    //copy positions into global array
    for (let iVertex = 0; iVertex < this.vertexPos.length; iVertex++) {

      //the index describes the cursor to the right position in the global
      //vertex array, it's offset + vertex * 2 because each vertex needs two
      //elements
      const index = iVertex * 2 + offset;
      if(this.vertexPos[iVertex][1] > 0) {

        //use u field to store the height of the cube
        uvs[index + 0] = newHeight * scale;

        //use v field to store the last height of the cube
        uvs[index + 1] = oldHeight * scale;
      }
    }
  }

}
