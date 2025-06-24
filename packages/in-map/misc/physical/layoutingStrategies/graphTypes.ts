/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import RoEmitter from '@instana/roemitter';
import { Observable } from '@instana/observables';

import { CollectionStream } from 'in-map/stores/ObjectCollectionStream';
import { HealthInfo, Nullish } from 'in-types';

// Created for understanding how different Scene Object entities interact with each other in infra map

// three js has no types :(
export interface Vector3 {
  x: Number;
  y: Number;
  z: Number;
}

export interface Subscriber {
  subscriptions: Observable<any>[];
  addSubscription: (subscription: Observable<any>) => void;
  addSubscriptions: (subscription: Observable<any>[]) => void;
  disposeSubscriptions: () => void;
  dispose: () => void;
}

export interface entity {
  id: string;
  healthInfo: any;
  children: entity[];
  c: entity[];
}

// Contains a group of SceneObjects like label, infra stack and boundary
export interface Group {
  id: string;
  sceneObject: SceneObject;
  subscriptions: Observable<any>[];
  transform: {
    position: Vector3;
    scale: Vector3;
  };
  _cachedLabel: string;
}

// Represents packages/in-map/sceneObjects/physical/Node.js
export interface Node extends SceneObject {
  _cachedLabel: string;
  group: Group;
  layer: CollectionStream<SceneObject>;
  init: () => void;
  initComponents: () => void;
  initEvents: () => void;
  initialized: () => void;
  isVisibleChanged: (isVisible: boolean) => void;
  healthChanged: (health: HealthInfo) => void;
  wordUnitsToPxChanged: ([Relation, transform]: [Number, Vector3]) => void;
  addLayer: (id: string, node: Node) => void;
  removeLayer: (id: string) => void;
  dispose: () => void;
}

// Represents packages/in-map/sceneObjects/SceneObject.js
export interface SceneObject extends Subscriber {
  id: string;
  entity: entity;
  eventEmitter: RoEmitter<Record<string, any>>; // can be any because its dependent on SceneObject that emits event
  // components holds a bunch of mutation-related components that help with positioning, scale, colour etc..
  components: Map<string, TransformationComponent | ScreenPositionComponent | SceneObject>;
  defaultColor: String | Nullish;
  nodes: Map<string, Node>;
}

// Represents packages/in-map/sceneObjectComponents/TransformationComponent/TransformationComponent.js
export interface TransformationComponent extends SceneObject {
  transform: {
    position: Vector3;
    scale: Vector3;
  };
  initEvents: () => void;
  powerChanged: (power: Number) => void;
  // setPositionXYZ is called upon by layouter like PackedLayouter and SimpleLayouter.
  // This then triggers a change in positioning anchor in ScreenPositionComponent by emitting event to Node
  setPositionXYZ: (x: Number, y: Number, z: Number) => void;
  setScaleXYZ: (x: Number, y: Number, z: Number) => void;
  setTransform: (position: Vector3, scale: Vector3) => void;
  setTransformXYZ: (x: Number, y: Number, z: Number) => void;
  setScale: (scale: Vector3) => void;
  getPosition: () => Vector3;
  getScale: () => Vector3;
  dispose: () => void;
}

// Represents packages/in-map/sceneObjectComponents/ScreenPositionComponent/ScreenPositionComponent.js
export interface ScreenPositionComponent extends SceneObject {
  color: string;
  // This is a callback function that is set by the Node component which
  // does some mutation to the x, y and z position given its current position and scale
  get3DPositionToProjectCallback: (position: Vector3, scale: Vector3) => Vector3;
  screenPositionAnchor: Vector3;
  screenPosition: Vector3;
  wasInView: boolean;
  isVisibleChanedKey: string;
  positionChangedKey: string;
  identity: (position: Vector3) => Vector3;
  initEvents: () => void;
  transformationChanged: (transform: Vector3) => void;
  willRender: () => void;
  set3DPositionToProject: (pos: Vector3) => void;
  setWidthInPx: (w: Number) => void;
  setHeightInPx: (h: Number) => void;
  updateScreenPosition: () => void;
  update: () => void;
  isInView: () => boolean;
  dispose: () => void;
}
