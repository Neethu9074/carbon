import Group from './sceneObjects/Groups/Group';
import UnknownGroup from './sceneObjects/Groups/UnknownGroup';

export function getAllNodes(parent) {
  const nodes = [];
  getNodes(parent, nodes);
  return nodes;
}

function getNodes(parent, nodes) {
  const col = getChildren(parent);
  if(!col) {return; }

  col.forEach((child) => {
    if(child instanceof Group || child instanceof UnknownGroup) {
      getNodes(child, nodes);
    } else {
      nodes.push(child);
    }
  });
}

export function getChildren(parent) {
  if(!parent) {
    return null;
  }
  if(parent instanceof Group || parent instanceof UnknownGroup){
    return parent.children;
  }
  return parent.groups;
}

export function getAllGroups(parent) {
  const groups = [];
  getGroups(parent, groups);
  return groups;
}

function getGroups(parent, groups) {
  const col = getChildren(parent);
  if(!col) {return; }

  col.forEach((child) => {
    if(child instanceof Group || child instanceof UnknownGroup) {
      groups.push(child);
      getGroups(child, groups);
    }
  });
}
