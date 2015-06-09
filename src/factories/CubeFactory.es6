
'use strict';
import THREE from 'three';
import MeshFactory from './MeshFactory';
import {theme} from 'instana-ui-services/theme';
import {health} from 'instana-ui-services/health';


const ok = new THREE.Color(theme.map.colors.default);
const colorItemsOk = [
  [ok.r, ok.g, ok.b], //front
  [ok.r + 0.1, ok.g + 0.1, ok.b + 0.1], //top
  [ok.r + 0.1, ok.g + 0.1, ok.b + 0.1] //left
];

const warning = new THREE.Color(theme.map.colors.warning);
const colorItemsWarning = [
  [warning.r, warning.g, warning.b], //front
  [warning.r + 0.1, warning.g + 0.1, warning.b + 0.1], //top
  [warning.r + 0.1, warning.g + 0.1, warning.b + 0.1] //left
];

const critical = new THREE.Color(theme.map.colors.critical);
const colorItemsDanger = [
  [critical.r, critical.g, critical.b], //front
  [critical.r + 0.1, critical.g + 0.1, critical.b + 0.1], //top
  [critical.r + 0.1, critical.g + 0.1, critical.b + 0.1] //left
];


export default class CubeFactory extends MeshFactory {

  constructor({scene}) {
    super({scene});

    this.setMaterial(new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending
    }));

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

    this.numDifferentColors = 3;
  }

  getColorArrayForFragment(fragment) {
    const fragHealth = fragment.health;

    if(!fragHealth) {
      return colorItemsOk;
    }

    if(fragHealth === health.warning) {
      return colorItemsWarning;
    } else if(fragHealth === health.danger) {
      return colorItemsDanger;
    }
    return colorItemsOk;
  }
}
