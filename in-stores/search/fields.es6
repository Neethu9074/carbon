import {filters$} from 'in-components/SearchBar/stores/filters';


const filterNode = node('filter');
filters$.subscribe(_filters => {
  filterNode.description = `(${_filters.size})`;
  filterNode.children = _filters
  .toArray()
  .map(_filter => node(_filter.get('name'), {
    isPreset: true,
    query: _filter.get('definition'),
    description: _filter.get('definition')
  }));
});

let tree;
function getTree() {
  if (!tree) {
    buildCategorizedFields();
  }
  return tree;
}

export function node(name, props = {}) {
  return {
    name,
    description: props.description || '',
    children: props.children || {},
    isPreset: props.isPreset || false,
    query: props.query || name,
  };
}

export function buildCategorizedFields(fields) {
  const root = node('root');
  fields = fields || window.instana.searchFields;

  fields.forEach(field => {
    const path = field.alias.split('.');
    let currentNode = root;

    for (let i = 0, length = path.length - 1; i < length; i++) {
      const pathPart = path[i];
      if (!currentNode.children[pathPart]) {
        currentNode.children[pathPart] = node(pathPart);
      }
      currentNode = currentNode.children[pathPart];
    }

    const lastPart = path[path.length - 1];
    currentNode.children[lastPart] = node(lastPart, {
      description: field.description
    });
  });
  root.children[filterNode.name] = filterNode;

  mapChildrenObjectsToArrays(root);
  tree = root;
}

function mapChildrenObjectsToArrays(node) {
  node.children = Object.keys(node.children).map(key => node.children[key]);
  for (let i = 0, length = node.children.length; i < length; i++) {
    mapChildrenObjectsToArrays(node.children[i]);
  }
}

export function findNode(query) {
  const root = getTree();

  if (!query || query.length === 0) {
    return root;
  }
  return findInNode(root, query);
}

function findInNode(node, query) {
  if (!node) {
    return null;
  }

  const path = query.split('.');
  const currentPart = path[0];

  for (let i = 0, length = node.children.length; i < length; i++) {
    const child = node.children[i];
    // path.length is only > 1 if the the query contains a '.'
    if (child.name === currentPart && path.length > 1) {
      return findInNode(child, query.substring(currentPart.length + 1));
    }
  }

  // if the user presses dot (.) but the previous string hasn't matched anything, return only directly matching results
  const children = path.length > 1
    ? node.children.filter(child => child.name === currentPart)
    : node.children.filter(child => child.name.startsWith(currentPart));
  return children.length === 0 ? null : node;
}

export const operatorTree = node('root', {
  children: [
    node('AND', { isPreset: true }),
    node('OR', { isPreset: true }),
    node('NOT', { isPreset: true }),
  ]
});
