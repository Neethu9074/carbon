import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';
import eventBus from 'in-services/eventbus';

import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import {DIRECTIONS} from '../Connections/ConnectionDirections';


export const allConnections = [];

export default class ProcessConnection extends SceneObjectWithSnapshot {

  constructor({parent, entity, sourceNode, destinationNode, direction}) {
    super({parent, id: entity.get('id')});

    this.direction = direction;
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;

    this.calculateGeometry();
    this.scene.addSceneObject(this.mesh);

    allConnections.push(this);

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() => this.calculateGeometry()));
    this.addSubscription(
      combineLatest([
        getSnapshot(sourceNode.id),
        getSnapshot(destinationNode.id)
      ])
      .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1]))
    );
  }

  init() {
    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      visible: false,
      linewidth: 2
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.LineSegments(this.geometry, this.material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
  }


  onInitialEnter() {
    this.material.visible = true;
  }

  onInitialLeave() {}

  onHighlightEnter() {
  }

  onHighlightLeave() {
  }

  onSelectedEnter() {}
  onSelectedLeave() {}

  onSelectedHighlightEnter() {}
  onSelectedHighlightLeave() {}

  onHiddenEnter() {}
  onHiddenLeave() {}

  onInactiveEnter() {
    this.material.visible = false;
  }


  calculateGeometry() {
    this.geometry.addAttribute('position',
      new THREE.BufferAttribute(
        new Float32Array(this.getLineVertices(this.sourceNode, this.destinationNode)), 3));

    this.geometry.attributes.position.needsUpdate = true;
  }

  getLineVertices(from, to) {
    const fromPos = from.getComponent('position').getPosition();
    const toPos = to.getComponent('position').getPosition();

    // calculating the path
    const path = this.path =  [fromPos, toPos];
    this.calculateCollisionMesh(path);

    // adding arrows
    // path = this.addArrowToDestination(path);

    // return the final line
    const flatPath = [];
    for (let i = 0; i < path.length; i++) {
      flatPath.push(path[i].x - 0.5);
      flatPath.push(path[i].y);
      flatPath.push(path[i].z + 0.5);
    }
    return flatPath;
  }

  getDirectionForPoints(a, b) {
    a.z = a.z || 0;
    b.z = b.z || 0;
    const dir = {x: b.x - a.x, y: b.y - a.y, z: b.z - a.z};

    // normalize them
    const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
    dir.x /= (length);
    dir.y /= (length);
    dir.z /= (length);

    return dir;
  }

  addArrowToDestination(path) {
    const from = this.direction === DIRECTIONS.IN ? 0 : path.length - 1;
    const to = this.direction === DIRECTIONS.IN ? 1 : path.length - 2;
    const arrowLength = 0.2;
    const fromP = path[from];
    const dir = this.getDirectionForPoints(path[from], path[to]);

    // because the arrow are laying on the ground, the up-vector is 0 1 0
    const right = new THREE.Vector3(0, 1, 0)
      .cross(dir)
      .multiplyScalar(arrowLength * 5); // shorten to get a angle < 45 degree
    const arrowLineX = (right.x + dir.x) * arrowLength;
    const arrowLineZ = (right.z + dir.z) * arrowLength;
    const arrowLineXLeft = (-right.x + dir.x) * arrowLength;
    const arrowLineZLeft = (-right.z + dir.z) * arrowLength;

    path.push(fromP);
    path.push({
      x: fromP.x + arrowLineX, y: fromP.y, z: fromP.z + arrowLineZ
    });

    path.push(fromP);
    path.push({
      x: fromP.x + arrowLineXLeft, y: fromP.y, z: fromP.z + arrowLineZLeft
    });

    return path;
  }

  calculateCollisionMesh(path) {
    const geometry = new THREE.Geometry();
    for (let i = 0; i < path.length; i++) {
      geometry.vertices.push(new THREE.Vector3(path[i].x, path[i].y, path[i].z));
    }

    this.collisionLine = new THREE.Line(geometry);
  }

  onSnapshotUpdated() {}

  setColorFromSnapshots(sourceSnapshot, destinationSnapshot) {
    const colorPool = getColorPool('processes');
    const sourceColor = colorPool.getColorRGB(sourceSnapshot.get('plugin'));
    const destinationColor = colorPool.getColorRGB(destinationSnapshot.get('plugin'));
    const color = [
      sourceColor.r, sourceColor.g, sourceColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b
    ];

    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3));
    this.geometry.attributes.color.needsUpdate = true;
  }

  intersects(raycaster) {
    if (!this.isActive() || !this.path || !this.collisionLine) {
      return false;
    }

    raycaster.linePrecision = 0.25;
    const hit = raycaster.intersectObject(this.collisionLine, false);
    return hit.length > 0;
  }

  onHighlight(isHighlighted) {
    const value = isHighlighted ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.stateMachine.changeStateProperty('highlight', value);
  }

  dispose() {
    super.dispose();
  }
}
