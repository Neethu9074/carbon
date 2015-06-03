'use strict';

import THREE from 'three';
import PlaneFactory from './PlaneFactory';
import {theme} from 'instana-ui-services/theme';


const warning = new THREE.Color(theme.map.colors.warning);
const critical = new THREE.Color(theme.map.colors.critical);

const colorItemsOk = [[0.0, 0.0, 0.0]];
const colorItemsWarning = [[warning.r, warning.g, warning.b]];
const colorItemsDanger = [[critical.r, critical.g, critical.b]];

export default class ZoneFactory extends PlaneFactory {
  constructor({scene}) {
    super({scene});
  }

  addFragment(fragment = {id, pos, dim, health}) {
    if(fragment.health === 'ok') {
      fragment.enabled = false;
    }
    super.addFragment(fragment);
  }

  getColorArrayForFragment(fragment) {
    const health = fragment.health;

    if(health === 'warning') {
      return colorItemsWarning;
    } else if(health === 'danger') {
      return colorItemsDanger;
    }
    return colorItemsOk;
  }
}
