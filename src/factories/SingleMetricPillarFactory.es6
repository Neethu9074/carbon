'use strict';

import THREE from 'three';
import TWEEN from 'tween.js'

import MeshFactory from './MeshFactory';

//import shader
import fragmentShader from './singleMetricFragmentShader.glsl';
import vertexShader from './singleMetricVertexShader.glsl';

const colorItemsOk = [
  [0.184, 0.64, 0.71], //front
  [0.212, 0.71, 0.745], //top
  [0.204, 0.694, 0.75] //left
];


export default class SingleMetricPillarFactory extends MeshFactory {

  constructor({scene}) {
    super({scene});

    this.setMaterial(new THREE.ShaderMaterial({
      uniforms: {
        progress: {
          type: 'f',
          value: 0.0
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      vertexColors: THREE.VertexColors,
      visible: window.location.search.match(/metrices/) ? true : false
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
      const fragment = frags[i];
      const newHeight = fragment.dim.y;
      const oldHeight = fragment.height === undefined ? 0.0 : fragment.height;
      const offset = i * this.vertexPos.length * 2;

      fragment.height = newHeight;
      this.fillUvs({uvs, offset, newHeight, oldHeight});
    }

    this.globalGeometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.startAnimation();
  }

  fillUvs({uvs, offset, newHeight, oldHeight}) {
    //copy positions into global array
    for (let iVertex = 0; iVertex < this.vertexPos.length; iVertex++) {
      const index = iVertex * 2 + offset;
      if(this.vertexPos[iVertex][1] > 0) {
        //use u field to store the height of the cube
        uvs[index + 0] = newHeight; //u
        uvs[index + 1] = oldHeight; //v
      }
    }
  }

  startAnimation() {
    const from = {v: 0.0};
    const to = {v: 1.0};
    const tween = new TWEEN.Tween(from).to(to, 500);
    const mat = this.material;
    const scene = this.scene;

    tween.onStart(function(){
      scene.startAnimation();
    });
    tween.onUpdate(function(){
      mat.uniforms.progress.value = from.v;
    });
    tween.onComplete(function(){
      scene.stopAnimation();
    });
    tween.start();
    tween.easing(TWEEN.Easing.Cubic.InOut);
  }
}
