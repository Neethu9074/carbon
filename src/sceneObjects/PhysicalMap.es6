'use strict';

import THREE from 'three';

import _ from 'lodash';
import Immutable from 'immutable';
import {create} from 'instana-ui-services/conveyer';
import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';
import {getZone} from 'instana-ui-sdk/zones';

import SceneObject from './SceneObject';
import groundTexturePath from './ground.png';
import Zone from './Zone';
import layout from '../layout';

export default class PhysicalMap extends SceneObject {

	constructor({scene}) {
    super({parent: scene});

		this.size = 1000;
		this.scene = scene;
    this.zones = [];

    const geo = new THREE.PlaneBufferGeometry(this.size, this.size, 1, 1);
		const mat = new THREE.MeshBasicMaterial({
			map: this.getGroundTexture(),
			transparent: true,
			opacity: 0.1,
			blending: THREE.NormalBlending,
			side: THREE.DoubleSide,
      depthWrite: false
		});

		const ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
		ground.rotation.x = -90 * Math.PI / 180;
		ground.position.y = -0.02;
		ground.updateMatrix();
		ground.matrixAutoUpdate = false;

		scene.addSceneObject(ground);

    this.bindToDatasource();
	}

	getGroundTexture() {
		const texture = THREE.ImageUtils.loadTexture(groundTexturePath);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(3 * this.size, 3 * this.size);
		//set the ground anisotropy to the max
		//because it's a huge ground always seen
		texture.anisotropy = 8;
		return texture;
	}

	bindToDatasource() {
		if (__DEV__ && window.location.search.indexOf('livedata') === -1) {
			return this.onInventoryUpdate(
				this.getDummyData(
					window.location.search.substring(1)));
		}

		const pluginId = 'com.instana.forge.infrastructure.os.OS';
		const observable = create(InventoryConveyer, {pluginId});
		this.addSubscription(observable.subscribe(
			snapshots => this.onInventoryUpdate(snapshots)
		));
	}

	onInventoryUpdate(snapshots) {
		snapshots.forEach(host => this.addHost(host));
		layout(this);
	}

	addHost(host) {
		const zoneId = getZone(host);
		let zone = _.find(this.zones, zone => zone.id === zoneId);
		if (!zone) {
			zone = new Zone({
				parent: this,
				id: zoneId,
				zoneIndex: this.zones.length
			});
			this.zones.push(zone);
		}
		zone.addHost({snapshot: host});
	}

	getDummyData(hostCount) {
		let dummies = [];
		for (let i = 0, max = hostCount || 10; i < max; i++) {
			dummies.push({
				hostId: 'ip-10-140-194-67.ec2.internal.' + i,
				steadyId: 'Linux.3.13.0-44-generic' + i,
				pluginId: 'com.instana.forge.infrastructure.os.OS',
				snapshot: {
					'availability-zone': 'us-east-1c',
					'cpu.count': i,
					'accumulated.status': {
						score: 1 - (i / max),
						labels: [
							'operating system instance',
							'operating system instance'
						],
						issues: [],
						solutions: []
					},
					'memory.total': 3947331 * i
				}
			});
		}
		return Immutable.fromJS(dummies);
	}
}
