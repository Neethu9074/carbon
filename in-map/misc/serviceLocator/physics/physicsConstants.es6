import {BoxGeometry} from 'three';

export const OCTREE_LAYER = {
  NODES: 0,
  LAYER: 1
};

export const PREDEFINED_COLLISION_OBJECTS = {
  BOX: new BoxGeometry(1, 1, 1, 1, 1, 1)
};
