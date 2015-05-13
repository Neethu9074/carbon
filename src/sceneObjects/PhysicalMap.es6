'use strict';

import THREE from 'three';

import _ from 'lodash';
import Immutable from 'immutable';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import {getZone} from 'instana-ui-sdk/zones';
import {isIdEqual} from 'instana-ui-services/util/snapshots';

import SceneObject from './SceneObject';
import groundTexturePath from './ground.png';
import Zone from './Zone';
import Layouter from '../layout';


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
    const texture = THREE.ImageUtils.loadTexture(
      groundTexturePath,
      undefined,
      () => { this.scene.renderScene(); });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3 * this.size, 3 * this.size);
    //set the ground anisotropy to the max
    //because it's a huge ground always seen
    texture.anisotropy = 8;
    this.groundtexture = texture;

    return texture;
  }

  bindToDatasource() {
    const pluginId = 'com.instana.forge.infrastructure.os.OS';
    const observable = create(SnapshotConveyer, {pluginId});
    this.addSubscription(observable.subscribe(
      snapshots => this.onInventoryUpdate(snapshots)
    ));
  }

  onInventoryUpdate(snapshots) {
    snapshots.forEach(host => this.addHost(host));

    // identify removed hosts
    const removedHosts = this.zones.reduce((hosts, zone) => {
      return hosts.concat(zone.hosts);
    }, [])
    .filter(host => {
      const snapshot = snapshots.find(
        snapshot => isIdEqual(snapshot, host.snapshot)
      );
      return !snapshot;
    });

    removedHosts.forEach(host => host.dispose());

    this.applyLayout(snapshots.size);
    this.parent.renderScene();
  }

  //is called from zone if it has no hosts anymore
  removeChild(child) {
    _.remove(this.zones, zone => zone.id === child.id);
  }

  applyLayout(numberOfHosts) {
    const maxHostsPerRow = Math.floor(
      Math.sqrt(numberOfHosts / this.zones.length));
    new Layouter({maxHostsPerRow}).applyLayout(this);
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
      zone.createLabel();
      this.zones.push(zone);
    }
    zone.addHost({snapshot: host});
  }

  onZoom(zoomLevel) {
    if(zoomLevel < 120) {
      this.groundtexture.repeat.set(3 * this.size, 3 * this.size);
    } else if(zoomLevel < 300) {
      this.groundtexture.repeat.set(this.size, this.size);
    }
  }

  dispose() {
    super.dispose();

    this.removeSceneObject(this.ground);

    this.size = null;
    this.zones = [];
    this.scene = null;
    this.parent = null;

    //clear three.js cache trough disposing
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.ground = null;
  }
}
