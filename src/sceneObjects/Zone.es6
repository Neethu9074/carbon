'use strict';

import _ from 'lodash';
import THREE from 'three';

import colors from '../colors';
import SceneObject from './SceneObject';
import Host from './Host';

export default class Zone extends SceneObject {

  constructor({parent, id, zoneIndex}) {
    super({parent});
    this.id = id;
    this.zoneIndex = zoneIndex;
    this.hosts = [];

    this.renderGround();
  }

  renderGround() {
    // using plane size of 1x1 because we are scaling it to the appropriate
    // size
    const geo = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
		const mat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.2,
			depthWrite: false,
      color: colors.zones[this.zoneIndex]
		});

		this.ground = new THREE.Mesh(geo, mat);
    // turn the ground around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
		this.ground.rotation.x = -90 * Math.PI / 180;

    this.addSceneObject(this.ground);
  }

  addHost(snapshot) {
    const hostId = snapshot.get('hostId');
		let host = _.find(this.hosts, host => host.id === hostId);
		if (!host) {
			host = new Host({
				parent: this,
				snapshot
			});
			this.hosts.push(host);
		} else {
      host.onSnapshotUpdate(snapshot);
    }
  }

  setPosition(position) {
    super.setPosition(position);
    this.ground.position.copy(position);
  }

  setScale(scale) {
    this.ground.scale.copy(scale);
  }
}
