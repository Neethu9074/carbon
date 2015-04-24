'use strict';

import THREE from 'three';

import _ from 'lodash';
import Immutable from 'immutable';
import {create} from 'instana-ui-services/conveyer';
import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';

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
		this.hostNumberCounter = 0;

    const geo = new THREE.PlaneBufferGeometry(this.size, this.size, 1, 1);
		const mat = new THREE.MeshBasicMaterial({
			map: this.getGroundTexture(),
			transparent: true,
			opacity: 0.1,
			depthWrite: false
		});

		const ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
		ground.rotation.x = -90 * Math.PI / 180;

		scene.addSceneObject(ground);

    this.bindToDatasource();
	}

	getGroundTexture() {
		const texture = THREE.ImageUtils.loadTexture(groundTexturePath);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(this.size + 1, this.size + 1);
		//set the ground anisotropy to the max
		//because it's a huge ground always seen
		texture.anisotropy = 8;
		return texture;
	}

	bindToDatasource() {
		if (__DEV__ && window.location.search.indexOf('livedata') === -1) {
			return this.onInventoryUpdate(this.getDummyData());
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
		const zoneId = host.getIn(['snapshot', 'availability-zone']);
		let zone = _.find(this.zones, zone => zone.id === zoneId);
		if (!zone) {
			zone = new Zone({
				parent: this,
				id: zoneId,
				zoneIndex: this.zones.length
			});
			this.zones.push(zone);
		}
		const hostNumber = ++this.hostNumberCounter;
		zone.addHost({snapshot: host, hostNumber});
	}

	getDummyData() {
		return Immutable.fromJS([
			{
				hostId: 'ip-10-140-194-67.ec2.internal',
				steadyId: 'Linux.3.13.0-44-generic',
				pluginId: 'com.instana.forge.infrastructure.os.OS',
				snapshot: {
					'availability-zone': 'us-east-1c',
					'cpu.count': 1,
					'accumulated.status': {
						score: 1,
						labels: [
							'operating system instance',
							'operating system instance'
						],
						issues: [],
						solutions: []
					},
					'memory.total': 3947331584
				}
			}, {
				hostId: 'ip-10-144-192-212',
				steadyId: 'Linux.3.8.0-37-generic',
				pluginId: 'com.instana.forge.infrastructure.os.OS',
				snapshot: {
					'availability-zone': 'eu-central',
					'cpu.count': 2,
					'accumulated.status': {
						score: 1,
						labels: [
							'operating system instance',
							'operating system instance'
						],
						issues: [],
						solutions: []
					},
					'memory.total': 7879286784
				}
			}, {
				hostId: 'ip-10-179-191-97.ec2.internal',
				steadyId: 'Linux.3.13.0-44-generic',
				pluginId: 'com.instana.forge.infrastructure.os.OS',
				snapshot: {
					'availability-zone': 'eu-west',
					'cpu.count': 1,
					'accumulated.status': {
						score: 1,
						labels: [
							'operating system instance',
							'operating system instance'
						],
						issues: [],
						solutions: []
					},
					'memory.total': 3947331584
				}
			}
		]);
	}
}
