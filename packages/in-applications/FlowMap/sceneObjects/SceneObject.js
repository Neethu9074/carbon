/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import RoEmitter from '@instana/roemitter';

import { Vector3 } from 'in-map/3DLibProvider';

export default class SceneObject {
  constructor(id, serviceLocatorUid) {
    this.id = id;
    this.serviceLocatorUid = serviceLocatorUid;

    this.events$ = new RoEmitter(this.id);

    this.position = new Vector3(0, 0, 0);
  }

  setPosition(x, y, z = 0) {
    this.position.set(x, y, z);
    this.events$.emit('transform', this.position);
  }

  getPosition() {
    return this.position;
  }

  dispose() {
    this.screenPosition = null;
    this.position = null;

    this.events$.dispose();
    this.events$ = null;
  }
}
