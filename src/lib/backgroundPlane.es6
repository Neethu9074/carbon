'use strict'

import THREE from 'three';
import {theme} from 'instana-ui-services/theme';

//we create a gradient from color1 to color2
const gradient1 = new THREE.Color(theme.map.colors.renderClearGradient1);
const gradient2 = new THREE.Color(theme.map.colors.renderClearGradient2);

const color1 = [gradient2.r, gradient2.g, gradient2.b];
const color2 = [gradient1.r, gradient1.g, gradient1.b];
const colorInBetween = [
  (color1[0] + color2[0]) / 2,
  (color1[1] + color2[1]) / 2,
  (color1[2] + color2[2]) / 2
]

const ti = new Uint32Array(6) //index arrax
const tp = new Float32Array(12); //position array
const tc = new Float32Array(12); //color array

ti[0] = 0; ti[1] = 1; ti[2] = 2;
ti[3] = 0; ti[4] = 2; ti[5] = 3;

tp[0] = -1; tp[1] = -1; tp[2] = -1;
tp[3] = 1; tp[4] = -1; tp[5] = -1;
tp[6] = 1; tp[7] = 1; tp[8] = -1;
tp[9] = -1; tp[10] = 1; tp[11] = -1;

tc[3] = color1[0]; tc[4] = color1[1]; tc[5] = color1[2]; //bottom left
tc[0] = colorInBetween[0]; tc[1] = colorInBetween[1]; tc[2] = colorInBetween[2];
tc[6] = colorInBetween[0]; tc[7] = colorInBetween[1]; tc[8] = colorInBetween[2];
tc[9] = color2[0]; tc[10] = color2[0]; tc[11] = color2[0]; //top right

const geometry = new THREE.BufferGeometry();
geometry.addAttribute('index', new THREE.BufferAttribute(ti, 1));
geometry.addAttribute('position', new THREE.BufferAttribute(tp, 3));
geometry.addAttribute('color', new THREE.BufferAttribute(tc, 3));
geometry.computeVertexNormals();

const material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh( geometry, material );
plane.position.z = -4;
plane.matrixAutoUpdate = false;

export default plane;
