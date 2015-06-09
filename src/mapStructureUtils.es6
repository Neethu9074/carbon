'use strict';

import THREE from 'three';
import Group from './sceneObjects/Group';


export function getAllNodes(parent) {
  const nodes = [];
  getNodes(parent, nodes);
  return nodes;
}

function getNodes(parent, nodes) {
  let col = getChildren(parent);
  if(!col) {return; }

  col.forEach((child) => {
    if(child instanceof Group) {
      getNodes(child, nodes);
    } else {
      nodes.push(child);
    }
  });
}

export function getChildren(parent) {
  if(parent instanceof Group){
    return parent.children;
  } else {
    return parent.groups;
  }
}

export function getAllGroups(parent) {
  const groups = [];
  getGroups(parent, groups);
  return groups;
}

function getGroups(parent, nodes) {
  let col = getChildren(parent);
  if(!col) {return; }

  col.forEach((child) => {
    if(child instanceof Group) {
      nodes.push(child);
      getNodes(child, nodes);
    }
  });
}
