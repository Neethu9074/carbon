import {blackListedSearchFieldAliases} from 'in-services/featureFlags';
import {filters$} from 'in-components/SearchBar/stores/filters';


const helpTexts = {
  'entity': 'Infrastructure and application entity',
  'entity.host': 'Infrastructure host',
  'entity.host.os': 'Operating system',
  'entity.service': 'Logical service',
  'entity.docker': 'Docker image and container',
  'entity.ruby': 'Ruby application',
  'entity.weblogic': 'Oracles Weblogic',
  'entity.nodejs': 'Node.js runtime and application',
  'entity.nodejs.app': 'Node.js application',
  'entity.ec2': 'Amazon EC2',
  'entity.dropwizard': 'Dropwizard application',
  'entity.elasticsearch': 'Elasticsearch database',
  'entity.elasticsearch.cluster': 'Elasticsearch cluster',
  'entity.marathon': 'Mesosphere Marathon',
  'entity.process': 'Operating system processe',
  'entity.jboss': 'JBoss application server',
  'entity.tomcat': 'Apache Tomcat',
  'entity.nomad': 'HashiCorp Nomad scheduler',
  'entity.gce': 'Google Compute Engine',
  'trace': 'Trace and root span',
  'event': 'Changes, issues, incidents and objectives',
  'span': ''
};

const filterNode = node('filter');
filters$.subscribe(_filters => {
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
    description: props.description || helpTexts[props.path],
    children: props.children || {},
    isPreset: props.isPreset || false,
    query: props.query || name,
    termType: props.termType
  };
}

export function buildCategorizedFields(fields) {
  const root = node('root');
  fields = fields || window.instana.searchFields;

  fields.forEach(field => {
    for (let i = 0, length = blackListedSearchFieldAliases.length; i < length; i++) {
      if (field.alias.startsWith(blackListedSearchFieldAliases[i])) {
        return;
      }
    }

    const path = field.alias.split('.');
    let currentNode = root;
    let completePath = '';

    for (let i = 0, length = path.length - 1; i < length; i++) {
      const pathPart = path[i];
      completePath += pathPart;
      if (!currentNode.children[pathPart]) {
        currentNode.children[pathPart] = node(pathPart, {
          path: completePath,
          numChildren: Object.keys(currentNode.children).length
        });
      }
      completePath += '.';
      currentNode = currentNode.children[pathPart];
    }

    const lastPart = path[path.length - 1];
    currentNode.children[lastPart] = node(lastPart, {
      description: field.description,
      termType: field.termType
    });
  });
  root.children[filterNode.name] = filterNode;

  mapChildrenObjectsToArrays(root);
  tree = root;
}

function mapChildrenObjectsToArrays(node) {
  node.children = Object.keys(node.children)
    .map(key => node.children[key])
    .sort((a, b) => a.name.localeCompare(b.name));
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
    node('+', { isPreset: true }),
    node('-', { isPreset: true })
  ]
});
