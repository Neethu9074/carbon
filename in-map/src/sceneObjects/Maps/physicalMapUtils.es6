import Group from '../Groups/PhysicalGroup';

export function getAllNodes(parent) {
  const nodes = [];
  getNodes(parent, nodes);
  return nodes;
}

function getNodes(parent, nodes) {
  const col = getChildren(parent);
  if (!col) {return; }

  col.forEach((child) => {
    if (child instanceof Group) {
      getNodes(child, nodes);
    } else {
      nodes.push(child);
    }
  });
}

export function getChildren(parent) {
  if (!parent) {
    return null;
  }
  if (parent instanceof Group) {
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
  if (!col) {return; }

  col.forEach((child) => {
    if (child instanceof Group) {
      groups.push(child);
      getGroups(child, groups);
    }
  });
}
