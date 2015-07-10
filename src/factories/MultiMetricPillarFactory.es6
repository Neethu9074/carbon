'use strict';

import THREE from 'three';
import TWEEN from 'tween.js';

import MeshFactory from './MeshFactory';

//import shader
import fragmentShader from './multiMetricFragmentShader.glsl';
import vertexShader from './multiMetricVertexShader.glsl';

import {theme} from 'instana-ui-services/theme';

const availableColors = (() => {
  const colors = [];
  const converter = new THREE.Color();

  fillIn(colors, converter, theme.chart.strokeColors[4]);
  fillIn(colors, converter, theme.chart.strokeColors[3]);
  fillIn(colors, converter, theme.chart.strokeColors[2]);
  fillIn(colors, converter, theme.chart.strokeColors[1]);
  fillIn(colors, converter, theme.chart.strokeColors[0]);

  return colors;
})();

function fillIn(colors, converter, hex) {
  converter.set(hex);
  colors.push([converter.r, converter.g, converter.b]);
}
const colorItems = [];


export default class MultiMetricPillarFactory extends MeshFactory {

  constructor({scene, numTiles = 3}) {
    super({scene});

    this.numTiles = numTiles;

    const progress = {type: 'f', value: 0.0};
    this.setupMaterial(progress);

    //for each tile there is a part of the geometry added
    this.vertexPos = this.calculateVertices(numTiles);

    //the color are generated on demand too because it depends
    //on the number of tiles
    this.calculateColorItems(numTiles);

    this.numDifferentColors = colorItems.length;

    const from = {v: 0.0};
    const to = {v: 1.0};
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.easing(TWEEN.Easing.Cubic.InOut);
    animation.onStart(() => scene.startAnimation());
    animation.onComplete(() => scene.stopAnimation());
    animation.onUpdate((v) => progress.value = v);
    this.animation = animation;
  }

  setupMaterial(progress) {
    this.setMaterial(new THREE.ShaderMaterial({
      uniforms: {
        progress: progress
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      vertexColors: THREE.VertexColors
    }));
  }

  addFragment(fragment) {
    //if the fragment has less tiles than the factory awaits
    if(fragment.tiles === undefined ||
      fragment.tiles.length < this.numTiles) {

      throw {error: 'argument exception'};
    }

    super.addFragment(fragment);
  }

  rebuild() {
    super.rebuild();
    this.updateHeights();
  }

/*eslint-disable max-statements */
  calculateVertices(numTiles) {
    const vertices = [];
    const normalCubeWidthHalf = (1.0 / 2.0);
    const widthInPercent = 0.8;
    const tx = normalCubeWidthHalf * widthInPercent;
    let index = 0;

    for (let i = 0; i < numTiles; i++) {
      const bottom = (1 / numTiles) * (i);
      const top = (1 / numTiles) * (i + 1);
      //front
      vertices[index++] = [-tx, bottom, tx];
      vertices[index++] = [tx, bottom, tx];
      vertices[index++] = [tx, top, tx];

      vertices[index++] = [-tx, bottom, tx];
      vertices[index++] = [tx, top, tx];
      vertices[index++] = [-tx, top, tx];

      //left
      vertices[index++] = [-tx, bottom, -tx];
      vertices[index++] = [-tx, bottom, tx];
      vertices[index++] = [-tx, top, -tx];

      vertices[index++] = [-tx, bottom, tx];
      vertices[index++] = [-tx, top, tx];
      vertices[index++] = [-tx, top, -tx];

      //top
      vertices[index++] = [-tx, top, tx];
      vertices[index++] = [tx, top, tx];
      vertices[index++] = [tx, top, -tx];

      vertices[index++] = [-tx, top, tx];
      vertices[index++] = [tx, top, -tx];
      vertices[index++] = [-tx, top, -tx];
    }

    return vertices;
  }
/*eslint-enable max-statements */

  //creates a gradient from black to white
  calculateColorItems(numTiles) {
    let index = 0;
    let colorIndex = 0;
    for (let i = 0; i < numTiles; i++) {
      const color = availableColors[colorIndex];
      colorIndex++;
      if(colorIndex >= availableColors.length) {
        colorIndex = 0;
      }

      colorItems[index++] = [color[0] - 0.1, color[1] - 0.1, color[2] - 0.1];
      colorItems[index++] = [color[0], color[1], color[2]];
      colorItems[index++] = [color[0] + 0.1, color[1] + 0.1, color[2] + 0.1];
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
      this.setHeightToUvs({uvs, iCube: i, fragment: frags[i]});
    }

    this.globalGeometry.addAttribute('uv',
      new THREE.BufferAttribute(uvs, numElementsPerUv));

    this.animation.stop();
    this.animation.start();
  }

/*eslint-disable max-statements */
  setHeightToUvs({uvs, iCube, fragment}) {
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
      const cursorPosition = offset + uvOffset;

      //look at the vertex array calculation. the third added vertex has a
      //top position in y, so get it
      const top = this.vertexPos[vertexOffset + 2][1]; //[1] is the y pos

      const tileIndex = ((this.numTiles * top) - 1) | 0;
      const tile = tiles[tileIndex];

      const fromNew = tile.new.from * scaleY;
      const toNew = tile.new.to * scaleY;
      const fromOld = tile.old.from * scaleY;
      const toOld = tile.old.to * scaleY;

      //front
      uvs[cursorPosition + 1] = fromOld;
      uvs[cursorPosition + 3] = fromOld;
      uvs[cursorPosition + 5] = toOld;
      uvs[cursorPosition + 7] = fromOld;
      uvs[cursorPosition + 9] = toOld;
      uvs[cursorPosition + 11] = toOld;

      uvs[cursorPosition + 13] = fromOld;
      uvs[cursorPosition + 15] = fromOld;
      uvs[cursorPosition + 17] = toOld;
      uvs[cursorPosition + 19] = fromOld;
      uvs[cursorPosition + 21] = toOld;
      uvs[cursorPosition + 23] = toOld;

      //left
      uvs[cursorPosition + 0] = fromNew;
      uvs[cursorPosition + 2] = fromNew;
      uvs[cursorPosition + 4] = toNew;
      uvs[cursorPosition + 6] = fromNew;
      uvs[cursorPosition + 8] = toNew;
      uvs[cursorPosition + 10] = toNew;

      uvs[cursorPosition + 12] = fromNew;
      uvs[cursorPosition + 14] = fromNew;
      uvs[cursorPosition + 16] = toNew;
      uvs[cursorPosition + 18] = fromNew;
      uvs[cursorPosition + 20] = toNew;
      uvs[cursorPosition + 22] = toNew;

      //top
      uvs[cursorPosition + 25] = toOld;
      uvs[cursorPosition + 27] = toOld;
      uvs[cursorPosition + 29] = toOld;
      uvs[cursorPosition + 31] = toOld;
      uvs[cursorPosition + 33] = toOld;
      uvs[cursorPosition + 35] = toOld;

      uvs[cursorPosition + 24] = toNew;
      uvs[cursorPosition + 26] = toNew;
      uvs[cursorPosition + 28] = toNew;
      uvs[cursorPosition + 30] = toNew;
      uvs[cursorPosition + 32] = toNew;
      uvs[cursorPosition + 34] = toNew;
    }
  }
/*eslint-enable max-statements */
}
