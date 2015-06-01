
'use strict';
import THREE from 'three';
import PlaneFactory from './PlaneFactory';

const colorItemsOk = [[0.0, 0.0, 0.0]];
const colorItemsWarning = [[0.51, 0.47, 0.08]];
const colorItemsDanger = [[0.42, 0.04, 0.13]];

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
