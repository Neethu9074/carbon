/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { BoxGeometry } from 'in-map/3DLibProvider';

export const OCTREE_LAYER = {
  NODES: 0,
  LAYER: 1
};

export const PREDEFINED_COLLISION_OBJECTS = {
  BOX: new BoxGeometry(1, 1, 1, 1, 1, 1)
};
