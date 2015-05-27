'use strict'

import THREE from 'three';


const ti = new Uint32Array(6)
const tp = new Float32Array(12);
const tc = new Float32Array(12);

  ti[0] = 0; ti[1] = 1; ti[2] = 2;
  ti[3] = 0; ti[4] = 2; ti[5] = 3;

  tp[0] = -1; tp[1] = -1; tp[2] = -1;
  tp[3] = 1; tp[4] = -1; tp[5] = -1;
  tp[6] = 1; tp[7] = 1; tp[8] = -1;
  tp[9] = -1; tp[10] = 1; tp[11] = -1;

  tc[0] = 0.13; tc[1] = 0.17; tc[2] = 0.19;
  tc[6] = 0.13; tc[7] = 0.17; tc[8] = 0.19;
  tc[3] = 0.15; tc[4] = 0.17; tc[5] = 0.19; //bottom left
  tc[9] = 0.1; tc[10] = 0.12; tc[11] = 0.14; //top right

const geometry = new THREE.BufferGeometry();
geometry.addAttribute( 'index', new THREE.BufferAttribute( ti, 1 ) );
geometry.addAttribute( 'position', new THREE.BufferAttribute( tp, 3 ) );
geometry.addAttribute( 'color', new THREE.BufferAttribute( tc, 3 ) );
geometry.computeVertexNormals();

const material = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh( geometry, material );
plane.position.z = -4;
plane.matrixAutoUpdate = false;

export default plane;
