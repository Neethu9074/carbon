/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import fragmentShader from 'in-applications/ApplicationMap/serviceLocator/ConnectionsServiceLocator/shader/fragmentShader.glsl';
import vertexShader from 'in-applications/ApplicationMap/serviceLocator/ConnectionsServiceLocator/shader/vertexShader.glsl';
import ParticleEmitter from 'in-applications/ApplicationMap/misc/ParticleEmitter';
import SceneObject from 'in-applications/ApplicationMap/sceneObjects/SceneObject';
import { Line, BufferGeometry, RawShaderMaterial } from 'in-map/3DLibProvider';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import Subscriber from 'in-map/misc/Subscriber';

const COLLISION_LINE_MATERIAL = new RawShaderMaterial({
  transparent: false,
  fragmentShader: fragmentShader,
  vertexShader: vertexShader
});

export default class Connection extends SceneObject {
  constructor(serviceLocatorUid, from, to) {
    super(createConnectionId(from.id, to.id), serviceLocatorUid);

    this.from = from;
    this.to = to;

    this.particleEmitter = new ParticleEmitter(this, serviceLocatorUid);

    this.initStartSubscriptions();
  }

  initStartSubscriptions() {
    this.subscriber = new Subscriber();
  }

  setParticlesOpacity(opacity) {
    this.particleEmitter.setOpacity(opacity);
  }

  setFromAndTo(from, to) {
    this.from = from;
    this.to = to;
  }

  setData(data) {
    this.events$.emit('data', data);
  }

  getDirection() {
    return this.direction;
  }

  updatePosition() {
    const fromPos = this.from.node.position;
    const toPos = this.to.node.position;
    this.particleEmitter.setFromAndToPositions(fromPos, toPos);

    this.createCollisionLine();
  }

  createCollisionLine() {
    this.disposeCollisionLine();

    const fromPos = this.from.node.position;
    const toPos = this.to.node.position;
    const collisionLine = (this.collisionLine = new Line(new BufferGeometry(), COLLISION_LINE_MATERIAL));
    collisionLine.frustumCulled = false;
    updateAttribute(this.collisionLine.geometry, 'position', [fromPos.x, fromPos.y, 0.1, toPos.x, toPos.y, 0.1]);
  }

  intersects(raycaster) {
    if (!this.collisionLine) {
      return false;
    }
    const hit = raycaster.intersectObject(this.collisionLine, false);
    for (let i = 0, length = hit.length; i < length; i++) {
      if (hit[i].distance >= 0) {
        return hit[i];
      }
    }
    return false;
  }

  disposeSubscriptions() {}

  disposeCollisionLine() {
    if (this.collisionLine) {
      this.collisionLine.geometry.dispose();
      this.collisionLine = null;
    }
  }

  dispose() {
    super.dispose();

    this.subscriber.dispose();
    this.subscriber = null;

    this.particleEmitter.dispose();
    this.particleEmitter = null;

    this.disposeCollisionLine();

    this.serviceLocatorUid = null;
    this.from = null;
    this.to = null;
  }
}

export function createConnectionId(fromId, toId) {
  return `${fromId}-to-${toId}`;
}
