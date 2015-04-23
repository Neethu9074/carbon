'use strict';

import THREE from 'three';

import _ from 'lodash';
import Immutable from 'immutable';

import SceneObject from './SceneObject';
import groundTexturePath from './ground.png';
import Zone from './Zone';

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
			depthWrite: false
		});

		const ground = new THREE.Mesh(geo, mat);
		ground.rotation.x = -90 * Math.PI / 180;

		scene.addSceneObject(ground);

    this.fillMap();
	}

	getGroundTexture() {
		const texture = THREE.ImageUtils.loadTexture(groundTexturePath);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(this.size, this.size);
		//set the ground anisotropy to the max
		//because it's a huge ground always seen
		texture.anisotropy = 8;
		return texture;
	}

  fillMap() {
    this.getSnapshots().forEach((host) => this.addHost(host));
  }

	addHost(host) {
		const zoneId = host.getIn(['snapshot', 'availability-zone']);
		let zone = _.find(this.zones, zone => zone.id === zoneId);
		if (!zone) {
			zone = new Zone({
				parent: this,
				id: zoneId
			});
			this.zones.push(zone);
		}
		zone.addHost(host);
	}

	getSnapshots() {
		const snapshots = Immutable.fromJS([{
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

    return snapshots;
	}
}
