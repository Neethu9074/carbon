'use strict';

import THREE from 'three';
import _ from 'lodash';
import TWEEN from 'tween.js';

import MeshFactory from './MeshFactory';

//import shader
import fragmentShader from './multiMetricFragmentShader.glsl';
import vertexShader from './multiMetricVertexShader.glsl';

const colorItems = [];


export default class MultiMetricPillarFactory extends MeshFactory {

  constructor({scene, numTiles = 3}) {
    super({scene});

    this.numTiles = numTiles;

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
      visible: window.location.search.match(/multimetrices/) ? true : false
    }));

    //for each tile there is a part of the geometry added
    this.vertexPos = this.calculateVertices(numTiles);

    //the color are generated on demand too because it depends
    //on the number of tiles
    this.calculateColorItems(numTiles);

    this.numDifferentColors = colorItems.length;
  }

  addFragment(fragment) {
    //if the fragment has less tiles than the factory awaits
    if(fragment.tiles === undefined ||
      fragment.tiles.length < this.numTiles) {

      throw {error: 'argument exception'};
    }

    super.addFragment(fragment);
  }

/*eslint-disable max-statements */
  calculateVertices(numTiles) {
    const vertices = [];
    let index = 0;

    for (let i = 0; i < numTiles; i++) {
      const bottom = (1 / numTiles) * (i);
      const top = (1 / numTiles) * (i + 1);
      //front
      vertices[index++] = [-0.4, bottom, 0.4];
      vertices[index++] = [0.4, bottom, 0.4];
      vertices[index++] = [0.4, top, 0.4];

      vertices[index++] = [-0.4, bottom, 0.4];
      vertices[index++] = [0.4, top, 0.4];
      vertices[index++] = [-0.4, top, 0.4];

      //left
      vertices[index++] = [-0.4, bottom, -0.4];
      vertices[index++] = [-0.4, bottom, 0.4];
      vertices[index++] = [-0.4, top, -0.4];

      vertices[index++] = [-0.4, bottom, 0.4];
      vertices[index++] = [-0.4, top, 0.4];
      vertices[index++] = [-0.4, top, -0.4];
    }

    return vertices;
  }
/*eslint-enable max-statements */

  //creates a gradient from black to white
  calculateColorItems(numTiles) {
    let index = 0;
    for (let i = 0; i < numTiles; i++) {
      const color = (1 / numTiles) * i; //[0, 1]
      colorItems[index++] = [color, color, color];
      colorItems[index++] = [color + 0.1, color + 0.1, color + 0.1];
    }
  }

  getColorArrayForFragment() {
    return colorItems;
  }

  updateHeights() {
    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const numElementsPerUv = 2; //u & v
    const uvs = new Float32Array(
      numCubes * this.vertexPos.length * numElementsPerUv);

    for (let i = 0; i < numCubes; i++) {
      this.fillUvs({uvs, iCube: i, fragment: frags[i]});
    }

    this.globalGeometry.addAttribute('uv',
      new THREE.BufferAttribute(uvs, numElementsPerUv));

    this.startAnimation();
  }

/*eslint-disable max-statements */
  fillUvs({uvs, iCube, fragment}) {
    const tiles = fragment.tiles;
    const numVertices = this.vertexPos.length;
    const scaleY = fragment.dim.y;
    const offset = iCube * numVertices * 2;
    const verticesPerTile = numVertices / this.numTiles;

    //for each part of the pillar
    for (let iTiles = 0; iTiles < this.numTiles; iTiles++) {
      //this is the offset to get the right cursor position to the vertices
      //in the global array
      const vertexOffset = iTiles * verticesPerTile;

      //two elements per vertex so the offset must shift by 2
      const uvOffset = vertexOffset * 2;

      //look at the vertex array calculation. the third added vertex has a
      //top position in y, so get it
      const top = this.vertexPos[vertexOffset + 2][1]; //[1] is the y pos

      const tileIndex = ((this.numTiles * top) - 1) | 0;
      const tile = tiles[tileIndex];

      const fromNew = tile.new.from * scaleY;
      const toNew = tile.new.to * scaleY;
      const fromOld = tile.old.from * scaleY;
      const toOld = tile.old.to * scaleY;

      uvs[offset + uvOffset + 1] = fromOld;
      uvs[offset + uvOffset + 3] = fromOld;
      uvs[offset + uvOffset + 5] = toOld;
      uvs[offset + uvOffset + 7] = fromOld;
      uvs[offset + uvOffset + 9] = toOld;
      uvs[offset + uvOffset + 11] = toOld;

      uvs[offset + uvOffset + 13] = fromOld;
      uvs[offset + uvOffset + 15] = fromOld;
      uvs[offset + uvOffset + 17] = toOld;
      uvs[offset + uvOffset + 19] = fromOld;
      uvs[offset + uvOffset + 21] = toOld;
      uvs[offset + uvOffset + 23] = toOld;

      uvs[offset + uvOffset + 0] = fromNew;
      uvs[offset + uvOffset + 2] = fromNew;
      uvs[offset + uvOffset + 4] = toNew;
      uvs[offset + uvOffset + 6] = fromNew;
      uvs[offset + uvOffset + 8] = toNew;
      uvs[offset + uvOffset + 10] = toNew;

      uvs[offset + uvOffset + 12] = fromNew;
      uvs[offset + uvOffset + 14] = fromNew;
      uvs[offset + uvOffset + 16] = toNew;
      uvs[offset + uvOffset + 18] = fromNew;
      uvs[offset + uvOffset + 20] = toNew;
      uvs[offset + uvOffset + 22] = toNew;
    }
  }
/*eslint-enable max-statements */

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
