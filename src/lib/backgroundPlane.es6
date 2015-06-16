'use strict'

import THREE from 'three';
import {theme} from 'instana-ui-services/theme';
import {hexToRGBNormalized} from 'instana-ui-services/converters';


//we create a gradient from color1 to color2
const color1 = hexToRGBNormalized(theme.map.colors.renderClearGradient1);
const color2 = hexToRGBNormalized(theme.map.colors.renderClearGradient2);

const colorInBetween = {
  r: (color1.r + color2.r) / 2,
  g: (color1.g + color2.g) / 2,
  b: (color1.b + color2.b) / 2
}

const ti = new Uint32Array(6) //index arrax
const tp = new Float32Array(12); //position array
const tc = new Float32Array(12); //color array

ti[0] = 0; ti[1] = 1; ti[2] = 2;
ti[3] = 0; ti[4] = 2; ti[5] = 3;

tp[0] = -1; tp[1] = -1; tp[2] = -1;
tp[3] = 1; tp[4] = -1; tp[5] = -1;
tp[6] = 1; tp[7] = 1; tp[8] = -1;
tp[9] = -1; tp[10] = 1; tp[11] = -1;

tc[3] = color1.r; tc[4] = color1.g; tc[5] = color1.b; //bottom left
tc[0] = colorInBetween.r; tc[1] = colorInBetween.g; tc[2] = colorInBetween.b;
tc[6] = colorInBetween.r; tc[7] = colorInBetween.g; tc[8] = colorInBetween.b;
tc[9] = color2.r; tc[10] = color2.g; tc[11] = color2.b; //top right

const geometry = new THREE.BufferGeometry();
geometry.addAttribute('index', new THREE.BufferAttribute(ti, 1));
geometry.addAttribute('position', new THREE.BufferAttribute(tp, 3));
geometry.addAttribute('color', new THREE.BufferAttribute(tc, 3));
geometry.computeVertexNormals();

const material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(geometry, material);
plane.matrixAutoUpdate = false;
plane.rotationAutoUpdate = false;

export default plane;
