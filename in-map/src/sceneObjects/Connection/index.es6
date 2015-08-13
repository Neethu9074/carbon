import THREE from 'three';
import _ from 'lodash';

import eventBus from 'in-services/eventbus';

import ConnectionGrid from '../../ConnectionGrid_Temp';
import SceneObject from '../SceneObject';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import LCP from '../../SingleMeshFactory/ContentProvider/LineContentProvider';

const darkGrey = {r: 0.5, g: 0.5, b: 0.5};
const lightGrey = {r: 0.7, g: 0.7, b: 0.7};
const fullWhite = {r: 1, g: 1, b: 1};
export const allConnections = [];
let id = 0;


export default class Connection extends SceneObject {

  constructor({from, to, direction}) {
    super({parent: from, id: id++});

    this.direction = direction;
    this.from = from;
    this.to = to;

    this.lineContentProvider = new LCP();
    this.fragment = {
      id: this.id,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: this.lineContentProvider
        })
      })
    };

    this.calculatePath();

    from.getComponent('connection').addOutgoingConnection(this);
    to.getComponent('connection').addIncomingConnection(this);

    this.render();

    allConnections.push(this);

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() =>
      this.updateOfVisualComponents()));
  }

  onInitialEnter() {
    this.enableFragment(false);
  }

  onInitialLeave() {}

  onHighlightEnter() {
    this.enableFragment();
    this.lineContentProvider.setColor(darkGrey);
  }

  onHighlightLeave() {
    this.enableFragment(false);
  }

  onSelectedEnter() {
    this.enableFragment();
    this.lineContentProvider.setColor(lightGrey);

    // show hide connected nodes on highlighting factory
    this.from.highlight();
    this.to.highlight();
  }

  onSelectedLeave() {
    this.enableFragment(false);

    // hide connected nodes on highlighting factory
    if(!this.oneEndpointIsSelected() && !this.toIsConnectedToSelected()) {
      this.to.highlight(false);
      this.from.highlight(false);
    }
  }

  onSelectedHighlightEnter() {
    this.enableFragment();
    this.lineContentProvider.setColor(fullWhite);
  }

  onSelectedHighlightLeave() {
    this.enableFragment(false);
  }

  onHiddenEnter() {
    this.enableFragment(false);
  }

  onHiddenLeave() {
    if(!this.oneEndpointIsSelected()) {
      this.enableFragment();
    }
  }

  enableFragment(enabled=true) {
    this.scene.lineFactory.enableFragment(this.id, enabled);
  }

  calculatePath() {
    const fromPos = this.from.getComponent('position').getPosition();
    const toPos = this.to.getComponent('position').getPosition();

    if(!fromPos || !toPos) {
      this.path = undefined;

    } else {
      this.path = ConnectionGrid.getPath({
        fromX: fromPos.x,
        fromY: -fromPos.z, //connectionGrid uses positive z space, so invert
        toX: toPos.x,
        toY: -toPos.z
      });
    }
  }

  toVertexArray(points) {
    const va = [];
    points.forEach(position => {
      va.push(position.x);
      va.push(position.y);
      va.push(position.z);
    });
    return va;
  }

  render() {
    if(!this.path) {
      return;
    }

    this.points = this.calculateVertices(-0.01);
    this.lineContentProvider.setLines(this.toVertexArray(this.points));
    this.scene.lineFactory.addFragment(this.fragment);

    //hide this if the parent is hidden
    if(this.from.isHidden() || this.to.isHidden()) {
      this.hide();
    }
  }

  calculateCollisionMesh(points) {
    const geometry = new THREE.Geometry();
    for (let i = 0; i < points.length; i++) {
      geometry.vertices.push(new THREE.Vector3(
        points[i].x, points[i].y, points[i].z));
    }

    this.collisionLine = new THREE.Line(geometry);
  }

  calculateVertices(height) {
    const points = [];

    //vertices have to be calculated in the following order:
    //[ p0, p1, p1, p2, p2, p3, ... ] the reason is that we use lineparts and
    //openGL is drawing the lines in this order
    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const nextPoint = this.path[i - 1];

      points.push({
        x: nextPoint.position.x - 0.5,
        y: height,
        z: -nextPoint.position.y + 0.5
      });
      points.push({
        x: point.position.x - 0.5,
        y: height,
        z: -point.position.y + 0.5
      });
    }
    this.postProcessPoints(points);
    this.calculateCollisionMesh(points);

    if(this.direction === 'in') {
      this.addArrow(points, 0, 1);
    } else {
      this.addArrow(points, points.length - 1, points.length - 2);
    }

    return points;
  }

  addArrow(points, from, to) {
    const arrowLength = 0.2;
    const fromP = points[from];
    const dir = this.getDirectionForPoints(points[from], points[to]);

    //because the arrow are laying on the ground, the up-vector is 0 1 0
    const right = new THREE.Vector3(0, 1, 0)
      .cross(dir)
      .multiplyScalar(arrowLength * 5); //shorten to get a angle < 45 degree
    const arrowLineX = (right.x + dir.x) * arrowLength;
    const arrowLineZ = (right.z + dir.z) * arrowLength;
    const arrowLineXLeft = (-right.x + dir.x) * arrowLength;
    const arrowLineZLeft = (-right.z + dir.z) * arrowLength;

    points.push(fromP);
    points.push({
      x: fromP.x + arrowLineX, y: fromP.y, z: fromP.z + arrowLineZ
    });

    points.push(fromP);
    points.push({
      x: fromP.x + arrowLineXLeft, y: fromP.y, z: fromP.z + arrowLineZLeft
    });
  }

  postProcessPoints(points) {
    const pathLength = points.length;
    const first = points[0];
    const second = points[1];
    const beforeLast = points[pathLength - 2];
    const last = points[pathLength - 1];
    const dirFirstToSecond = this.getDirectionForPoints(first, second);
    const dirlastToBeforeLast = this.getDirectionForPoints(last, beforeLast);

    //caps the first and last line of the connection. nodes have a size of 1 and
    //normally the connection goes from center (0.5, 0.5) to center. with this
    //capping it begins on the edge of the first and ends on the edge of the
    //last node. to get the right of the four possible we need the direction
    //directions are normalized so you can multiply with 0.5
    first.x += dirFirstToSecond.x * 0.5;
    first.y += dirFirstToSecond.y * 0.5;
    first.z += dirFirstToSecond.z * 0.5;

    last.x += dirlastToBeforeLast.x * 0.5;
    last.y += dirlastToBeforeLast.y * 0.5;
    last.z += dirlastToBeforeLast.z * 0.5;
  }

  getDirectionForPoints(a, b) {
    a.z = a.z || 0;
    b.z = b.z || 0;
    const dir = {x: b.x - a.x, y: b.y - a.y, z: b.z - a.z};

    //normalize them
    const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
    dir.x /= (length);
    dir.y /= (length);
    dir.z /= (length);

    return dir;
  }

  intersects(raycaster) {
    const state = this.stateMachine.state;
    const states = this.stateMachine.states;
    if(state === states.initial || state === states.inactive) {
      return false;
    }

    const path = this.path;
    if(!path || !this.collisionLine) {
      return false;
    }

    raycaster.linePrecision = 0.25;
    const hit = raycaster.intersectObject(this.collisionLine, false);
    return hit.length > 0;
  }

  select() {
    this.stateMachine.changeStateProperty('selected', true);
  }

  unSelect() {
    if(!this.oneEndpointIsSelected()) {
      this.stateMachine.changeStateProperty('selected', false);
    }
  }

  updateOfVisualComponents() {
    if(this.isSelected() || this.isHighlighted()) {
      this.calculatePath();
      this.render();
      this.reEnterState();
    }
  }

  //checks weather one of the endpoints (from and to) is in the selected state
  oneEndpointIsSelected() {
    return (this.from.isSelected() || this.to.isSelected());
  }

  //checks weather one of the endpoints (from and to) is connected to another
  //node which is in the selected state
  toIsConnectedToSelected() {
    let isConnectedToSelected = false;
    this.to.getComponent('connection').getAllConnections().forEach((c) => {
      if(c.oneEndpointIsSelected()) {
        isConnectedToSelected = true;
      }
    });
    return isConnectedToSelected;
  }

  disposeCollisionLine() {
    if(this.collisionLine) {
      this.collisionLine.geometry.dispose();
      this.collisionLine = null;
    }
  }

  dispose() {
    super.dispose();

    _.remove(allConnections, c => c.id === this.id);

    this.disposeCollisionLine();

    const connectionComponent = this.from.getComponent('connection');
    connectionComponent.removeOutgoingConnection(this);
    connectionComponent.removeIncomingConnection(this);

    this.scene.lineFactory.removeFragment(this.id);
  }
}
