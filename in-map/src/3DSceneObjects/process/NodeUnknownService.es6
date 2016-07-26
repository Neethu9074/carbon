import THREE from 'three';

import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';

import fragmentShader from 'in-map/src/SingleMeshFactory/fadeByDistanceFragmentShader.glsl';
import vertexShader from 'in-map/src/SingleMeshFactory/fadeByDistanceVertexShader.glsl';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster';
import {addSceneObject, removeSceneObject} from 'in-map/src/stores/sceneStore';
import {selectedSnapshotIdForHighlightingInMap} from 'in-map/src/mapStores';
import Label from 'in-map/src/3DSceneObjects/process/Label';
import Node from 'in-map/src/3DSceneObjects/process/Node';


export default class NodeUnknownService extends Node {

  constructor(props) {
    super(props);

    this.label = new Label({
      id: this.id,
      parent: this,
      snapshotId: this.id,
      iconSize: 2.75
    });

    const geometry = new THREE.SphereBufferGeometry(0.5, 20, 20);
    const material = new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
      uniforms: {
        minOpacity: {
          type: 'f',
          value: 0.1
        },
        maxOpacity: {
          type: 'f',
          value: 0.6
        }
      }
    });
    const mesh = this.mesh = new THREE.Mesh(geometry, material);
    addSceneObject(mesh);

    this.addSubscription(
      selectedSnapshotIdForHighlightingInMap.subscribe(id => {
        if (id) {
          material.uniforms.minOpacity.value = 0.25;
          material.uniforms.maxOpacity.value = 0.25;
        } else {
          material.uniforms.minOpacity.value = 0.1;
          material.uniforms.maxOpacity.value = 0.6;
        }
      })
    );
  }

  init() {
    this.height = 0.25;
  }

  onHighlightEnter() {}
  onHighlightLeave() {}
  onSelectedEnter() {}
  onSelectedLeave() {}
  onSelectedHighlightEnter() {}
  onSelectedHighlightLeave() {}

  addComponents(components) {
    const sceneObject = this;

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.screenPosition = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPosition'
    });
  }

  updateScreenPosition() {
    this.getComponent('screenPosition').updateScreenPosition();
  }

  positionChanged(newPos) {
    super.positionChanged(newPos);

    this.label.getComponent('position').setPosition(newPos.x - 0.5, this.height + 0.8, newPos.z + 0.5);
    this.mesh.position.set(newPos.x - 0.5, newPos.y, newPos.z + 0.5);
  }

  createSticky() {
    return new StickyNote(this);
  }

  getDragGhostGeometry() {
    return this.mesh.geometry;
  }

  dispose() {
    super.dispose();

    removeSceneObject(this.mesh);

    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;

    this.label.dispose();
    this.label = null;
  }
}
