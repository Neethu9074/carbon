
'use strict';
import THREE from 'three';
import PlaneFactory from './PlaneFactory';


export default class ZoneFactory extends PlaneFactory {
  constructor({scene}) {
    super({scene});

    this.colorItemsOk = [[0.9, 0.1, 0.1]];
    this.colorItemsWarning = [[0.51, 0.47, 0.08]];
    this.colorItemsDanger = [[0.5, 0.22, 0.1]];
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
      return this.colorItemsWarning;
    } else if(health === 'danger') {
      return this.colorItemsDanger;
    }
    return this.colorItemsOk;
  }
}
