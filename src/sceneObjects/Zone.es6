'use strict';

import _ from 'lodash';
import THREE from 'three';

import colors from '../colors';
import SceneObject from './SceneObject';
import Host from './Host';

//use global geometry to reduce object instances
const zoneGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);


export default class Zone extends SceneObject {

  constructor({parent, id, zoneIndex}) {
    super({parent});
    this.id = id;
    this.zoneIndex = zoneIndex;
    this.hosts = [];

    this.renderGround();
  }

  renderGround() {
    const zoneColor = colors.zones[this.zoneIndex];
		const mat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.2,
      color: zoneColor,
      side: THREE.DoubleSide,
      depthWrite: false
		});

		this.ground = new THREE.Mesh(zoneGeometry, mat);
    // turn the ground around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
		this.ground.rotation.x = -90 * Math.PI / 180;
    this.ground.renderOrder = 1;

    this.addSceneObject(this.ground);

    const edge = new THREE.EdgesHelper(this.ground, zoneColor);
    this.addSceneObject(edge);

    const label = this.getZoneLabel(this.id);
    this.ground.add(label);
  }

  getZoneLabel(text) {
    const canvas = document.createElement('canvas');

		// the larger these numbers, the larger the canvas, and
		// the smoother your final image can be. If your final
		// texture is blurry or pixelated, try increasing these
		// numbers, and drawing on the canvas in a larger font.
		canvas.width = 600;
		canvas.height = 100;
		const context = canvas.getContext('2d');

		context.fillStyle = 'rgb(255, 255, 255)';
		context.font = '100px Arial';
		context.fillText(text, 0, 95);

		// use canvas contents as a texture
		const texture = new THREE.Texture(canvas);

		//set the minFilter, because the texture could not be power of 2
		texture.minFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

    const mat = new THREE.MeshBasicMaterial({
			map: texture,
      transparent: true,
      side: THREE.DoubleSide
		});
    const label = new THREE.Mesh(zoneGeometry, mat);

    return label;
  }

  addHost({snapshot, hostNumber}) {
    const hostId = snapshot.get('hostId');
		let host = _.find(this.hosts, host => host.id === hostId);
		if (!host) {
			host = new Host({
				parent: this,
				snapshot,
        hostNumber
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

    if(this.ground.children.length > 0) {
      const scaleX = 1 / scale.x * 3;
      const scaleY = 1 / scale.y * 0.5;
      const scaleZ = 1 / scale.z;

      this.ground.children[0].position.set(
        -0.5 + scaleX / 2,
        -0.5 + scaleY / 2,
        -0.01);
      this.ground.children[0].scale.set(
        scaleX,
        scaleY,
        scaleZ
      );
    }
  }
}
