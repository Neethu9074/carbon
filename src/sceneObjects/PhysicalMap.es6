'use strict';

import THREE from 'three';

import _ from 'lodash';
import Immutable from 'immutable';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import ConnectionGrid from '../connectionGrid';
import {connections as allConnections} from './Connection';
import {getZone} from 'instana-ui-sdk/zones';
import {
  isIdEqual,
  getIdString,
  extractConnections} from 'instana-ui-services/util/snapshots';
import SceneObject from './SceneObject';
import groundTexturePath from './ground.png';
import Zone from './Zone';
import Layouter from '../layout';


export default class PhysicalMap extends SceneObject {

  constructor({scene}) {
    super({parent: scene});

    //the size of the map in world units
    this.size = 1000;

    this.scene = scene;
    this.zones = [];

    this.createGroundGrid();
    this.bindToDatasource();
  }

  createGroundGrid() {
    const geo = new THREE.PlaneBufferGeometry(this.size, this.size, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: this.getGroundTexture(),
      transparent: true,
      opacity: 0.1,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    ground.rotation.x = -90 * Math.PI / 180;
    ground.position.y = -0.02;

    //set static
    ground.matrixAutoUpdate = false;
    ground.rotationAutoUpdate = false;
    ground.updateMatrix();

    this.scene.addSceneObject(ground);
  }

  getGroundTexture() {
    const quadsPerWorldUnit = 3;
    const repating = quadsPerWorldUnit * this.size;
    const texture = THREE.ImageUtils.loadTexture(
      groundTexturePath,
      THREE.UVMapping,
      () => { this.scene.renderScene(); });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repating, repating);

    //set the ground anisotropy to the max because it's a huge ground always
    //seen and it needs to be as sharp as possible
    texture.anisotropy = this.scene.renderer.getMaxAnisotropy();

    this.groundtexture = texture;
    return texture;
  }

  bindToDatasource() {
    const pluginId = 'com.instana.forge.infrastructure.os.OS';
    const observable = create(SnapshotConveyer, {pluginId});
    this.addSubscription(
      observable.subscribe(data => this.onInventoryUpdate(data)));
  }

  applyLayout() {
    let numElementsOnMap = 0;
    this.zones.forEach(zone => {
      zone.hosts.forEach(() => {
        numElementsOnMap++;
      });
    });

    const maxHostsPerRow = Math.floor(
      Math.sqrt(numElementsOnMap / this.zones.length));
    new Layouter({maxHostsPerRow}).applyLayout(this);
  }

  onInventoryUpdate(snapshots) {
    const unknownZone = this.getOrCreateZone('unmonitored');
    const connections = extractConnections(snapshots);
    snapshots.forEach(host => this.addHost(host, connections, unknownZone));

    this.removeVanishedUnknownHosts(connections, unknownZone);
    this.removeVanishedHosts(snapshots);

    //delete the unknownZone if there are no hosts in it
    if(unknownZone.length === 0) {
      unknownZone.dispose();
    }

    this.applyLayout();
    this.setupConnections(snapshots, connections);
    //this.showWalkableGrid(); //uncomment this to see the walking grid
    this.parent.renderScene();
  }

  removeVanishedHosts(snapshots) {
    // identify removed hosts: hosts that are not inside the snapshot update
    const removedHosts = this.zones
      //get all hosts from all zones
      .reduce((hosts, zone) => {return hosts.concat(zone.hosts); }, [])
      //only the monitored
      .filter(host => !host.isUnknown)
      //only the ones that are not in snapshots anymore
      .filter(host => {
        const foundSnapshot = snapshots.find(snapshot =>
          isIdEqual(snapshot, host.snapshot));
        return !foundSnapshot;
      });

    removedHosts.forEach((host) => host.dispose());
  }

  addHost(host, connections, unknownZone) {
    const zoneId = getZone(host);
    const zone = this.getOrCreateZone(zoneId);

    //add the host to zone (the zone handles duplicates)
    zone.addHost({snapshot: host});

    //if the zone has switched,
    //delete the hosts in other zones than the current one
    this.removeHostFromAllZonesInsteadOf(zoneId, host);

    const hostConnections = connections.find((v, k) => k === host);
    if(hostConnections) {
      this.createAllUnknownHostsFor(host, hostConnections, unknownZone);
    }
  }

  getOrCreateZone(zoneId) {
    //get find the zone with zoneId
    let zone = _.find(this.zones, zone => zone.id === zoneId);

    //if the hosts zone doesn't exist, create it
    if (!zone) {
      zone = new Zone({
        parent: this,
        id: zoneId,
        zoneIndex: this.zones.length
      });
      zone.createLabel();
      this.zones.push(zone);
    }

    return zone;
  }

  //runs through all zones instead of the current one and searches for the
  //host added to the current one. if found -> delete it from old zones
  removeHostFromAllZonesInsteadOf(zoneId, host) {
    this.zones.forEach(zone =>{
      if(zone.id !== zoneId) {
        zone.hosts.forEach(zoneHost => {
          if(isIdEqual(host, zoneHost.snapshot)) {
            zoneHost.dispose();
          }
        });
      }
    });
  }

  createAllUnknownHostsFor(snapshot, connections, unknownZone) {
    const allConnections = connections.outgoing.concat(connections.incoming);

    allConnections.forEach((connection) => {
      //only create hosts that are unmonitored by agent
      if(connection.get('state') === 'unmonitored') {
        unknownZone.addHost({snapshot: connection, unknown: true});
      }
    });
  }

  removeVanishedUnknownHosts(connections, unknownZone) {
    const allUnmonitoredHosts = unknownZone.hosts;
    const allAvailableUnmonitoredHosts = [];

    connections.forEach((hostCons) => {
      const allConnections = hostCons.outgoing.concat(hostCons.incoming);
      allConnections.forEach((connection) => {
        if(connection.get('state') === 'unmonitored') {
          allAvailableUnmonitoredHosts.push(connection);
        }
      });
    });

    //get all created hosts which are not inside all current hosts collection
    const removed = allUnmonitoredHosts
      .filter(host => {
        const match = _.find(allAvailableUnmonitoredHosts, available => {
          return isIdEqual(available, host.snapshot);
        });
        return !match;
      });

    //dispose all found hosts
    removed.forEach((host) => host.dispose());
  }

  showWalkableGrid() {
    if(this.particles) {
      this.removeSceneObject(this.particles);
    }
    this.particles = ConnectionGrid.asVisualObject();
    this.addSceneObject(this.particles);
  }

  //is called after an inventory update incoming. the prerequirement is
  //that all hosts are available to connect the objects
  setupConnections(snapshots, connections) {
    //clear all connections
    allConnections.slice().forEach(connection => connection.dispose());

    const idHostMap = this.getIdHostMap();

    connections.forEach((hostCons, host) => {
      //if the from host is available
      const fromHost = idHostMap[getIdString(host)];
      if(fromHost) {

        hostCons.outgoing.forEach(connection => {
          //if the host has any connection
          if(connection) {
            //if to host is available
            const toHost = idHostMap[getIdString(connection)];
            if(toHost) {
              fromHost.connectWith(toHost);
            }
          }
        });

        hostCons.incoming.forEach(connection => {
          //if the host has any connection
          if(connection) {
            //if to host is available
            const toHost = idHostMap[getIdString(connection)];
            if(toHost) {
              toHost.connectWith(fromHost);
            }
          }
        });
      }
    });
  }

  //creates an object<getIdString(host), host> to get fast access to it
  getIdHostMap() {
    const map = {};

    this.zones.forEach(zone => {
      zone.hosts.forEach(host => {
        map[host.id] = host;
      });
    });

    return map;
  }

  filter(validationFunction) {
    const unMatched = this.zones
      //get all hosts from all zones
      .reduce((hosts, zone) => {return hosts.concat(zone.hosts); }, [])
      .filter(host => !validationFunction(host));

    unMatched.forEach((host) => host.hide());
  }

  //is called from zone if it has no hosts anymore
  removeChild(child) {
    _.remove(this.zones, zone => zone.id === child.id);
  }

  onZoom(zoomLevel) {
    const size = this.size;
    if(zoomLevel < 120) {
      this.groundtexture.repeat.set(3 * size, 3 * size);
    } else {
      this.groundtexture.repeat.set(size, size);
    }
  }

  dispose() {
    super.dispose();

    this.removeSceneObject(this.ground);

    //clear three.js cache trough disposing
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.ground = null;

    this.size = null;
    this.zones = [];
    this.scene = null;
    this.parent = null;
  }
}
