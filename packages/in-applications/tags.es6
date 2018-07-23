import { get, assign } from 'lodash';
import React from 'react';

import { compareIgnoreCase } from 'in-services/util/string';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { deepCopy } from 'in-services/util/object';

const tagKeys = [
  'agent.tag',
  'cassandra.cluster.name',
  'docker.container.name',
  'docker.image.name',
  'docker.label',
  'dropwizard.name',
  'elasticsearch.cluster.name',
  'host.fqdn',
  'host.name',
  'host.os.name',
  'host.zone',
  'agent.zone',
  'aws.ec2.zone',
  'azure.zone',
  'gce.zone',
  'nova.zone',
  'jvm.app.name',
  'kafka.cluster.name',
  'mongodb.cluster.name',
  'kubernetes.container.name',
  'kubernetes.namespace',
  'kubernetes.pod.label',
  'marathon.app.id',
  'nodejs.app.name',
  'nomad.job.name',
  'nomad.task.name',
  'ruby.name',
  'springboot.name'
];

export function getTagValuesAsOptions() {
  return [{ value: '', label: 'Please select' }].concat(tagKeys.map(label => ({ label }))).map(tag => (
    <option key={tag.label} value={tag.value || tag.label}>
      {tag.label}
    </option>
  ));
}

export function mapFromServerResponse(response) {
  if (!response.data) {
    return response;
  }

  if (response.data instanceof Array) {
    return assign({}, response, {
      data: response.data.map(mapConfig)
    });
  }

  return assign({}, response, {
    data: mapConfig(response.data)
  });
}

function mapConfig(config) {
  const matchSpecificationCopy = [];
  const matchSpecifications = config.matchSpecification;

  for (let i = 0; i < matchSpecifications.length; i++) {
    let matchSpecification = matchSpecifications[i];
    matchSpecificationCopy[i] = {
      key: matchSpecification.key,
      value: matchSpecification.value
    };
    matchSpecification = matchSpecificationCopy[i];

    if (matchSpecification.key.indexOf('docker.label.') === 0) {
      matchSpecification.value = `${matchSpecification.key.slice('docker.label.'.length)}=${matchSpecification.value}`;
      matchSpecification.key = 'docker.label';
    } else if (matchSpecification.key.indexOf('kubernetes.pod.label.') === 0) {
      matchSpecification.value = `${matchSpecification.key.slice('kubernetes.pod.label.'.length)}=${
        matchSpecification.value
      }`;
      matchSpecification.key = 'kubernetes.pod.label';
    } else if (matchSpecification.key.indexOf('agent.tag.') === 0) {
      matchSpecification.value = `${matchSpecification.key.slice('agent.tag.'.length)}=${matchSpecification.value}`;
      matchSpecification.key = 'agent.tag';
    }
  }

  return {
    id: config.id,
    label: config.label,
    name: config.name,
    enabled: config.enabled,
    matchSpecification: matchSpecificationCopy
  };
}

export function mapToServerResponse(config) {
  if (!config) {
    return config;
  }

  for (let i = 0; i < config.matchSpecification.length; i++) {
    const matchSpecification = config.matchSpecification[i];
    if (
      matchSpecification.key === 'docker.label' ||
      matchSpecification.key === 'kubernetes.pod.label' ||
      matchSpecification.key === 'agent.tag'
    ) {
      const indexOfFirstEqual = matchSpecification.value.indexOf('=');
      const stringBeforeEqual = matchSpecification.value.slice(0, Math.max(0, indexOfFirstEqual));
      const stringAfterEqual = indexOfFirstEqual >= 0 ? matchSpecification.value.slice(indexOfFirstEqual + 1) : '';

      if (matchSpecification.key === 'docker.label') {
        matchSpecification.key = `docker.label.${stringBeforeEqual}`;
        matchSpecification.value = stringAfterEqual;
      } else if (matchSpecification.key === 'kubernetes.pod.label') {
        matchSpecification.key = `kubernetes.pod.label.${stringBeforeEqual}`;
        matchSpecification.value = stringAfterEqual;
      } else if (matchSpecification.key === 'agent.tag') {
        if (indexOfFirstEqual === -1) {
          matchSpecification.key = `agent.tag`;
          matchSpecification.value = matchSpecification.value;
        } else if (indexOfFirstEqual === 0) {
          matchSpecification.key = `agent.tag`;
          matchSpecification.value = matchSpecification.value.slice(1);
        } else {
          matchSpecification.key = `agent.tag.${stringBeforeEqual}`;
          matchSpecification.value = stringAfterEqual;
        }
      }
    }
  }
  return config;
}

function isOnBlacklist(serverTag, blacklist) {
  if (blacklist[serverTag.fullyQualifiedName] || blacklist[serverTag.name]) {
    return true;
  }
  return false;
}

let tagTree = null;
let tagMap = null;
export function getTagTree() {
  if (tagTree == null) {
    buildTagTree();
  }

  return tagTree;
}

function buildTagTree() {
  const rootNode = createNode('root');
  tagTree = rootNode;
  tagMap = {};

  let tags = get(window, ['instana', 'tags'], []);
  if (!(tags instanceof Array)) {
    tags = [];
  }

  tags = deepCopy(tags)
    .filter(tag => !isOnBlacklist(tag, blacklists.generalBlacklist))
    .sort((a, b) => compareIgnoreCase(a.name, b.name));

  const tagsAsMap = {};
  for (let i = 0; i < tags.length; i++) {
    tagsAsMap[tags[i].name] = tags[i];
  }
  buildNodes(rootNode, tags, tagsAsMap);
}

function buildNodes(parentNode, level, tagsAsMap) {
  const categories = buildCategories('', level);
  markTags('', categories, tagsAsMap);
  mapCategoriesToNodes(parentNode, categories);
}

function buildCategories(path, tags) {
  if (tags.length === 0) {
    return [];
  }

  let categories = {};

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const tagCategory = tag.name.split('.')[0];
    if (!tagCategory) {
      continue;
    }

    if (!categories[tagCategory]) {
      categories[tagCategory] = {
        category: tag.category,
        path,
        prefix: tagCategory,
        children: []
      };
    }
    tag.name = tag.name.slice(tagCategory.length + 1);
    if (tag.name.length > 0) {
      categories[tagCategory].children.push(tag);
    }
  }

  categories = Object.keys(categories).map(key => categories[key]);
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    category.children = buildCategories(path + category.prefix + '.', category.children);
  }

  return categories;
}

function markTags(path, categories, tagsAsMap) {
  if (!categories) {
    return;
  }

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const fullyQualifiedPath = path ? path + '.' + category.prefix : category.prefix;
    const tagDefinition = tagsAsMap[fullyQualifiedPath];
    if (tagDefinition) {
      category.isTag = true;
      category.type = tagDefinition.type;
    }

    markTags(fullyQualifiedPath, category.children, tagsAsMap);
  }
}

function mapCategoriesToNodes(parentNode, categories) {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    const node = createNode(category.prefix, {
      fullyQualifiedName: category.path + category.prefix,
      parentNode,
      category: category.category
    });

    tagMap[node.fullyQualifiedName] = node;
    if (category.isTag) {
      node.isTag = true;
      node.type = category.type;
      node.category = category.category;
    }
    parentNode.addChild(node);

    mapCategoriesToNodes(node, category.children);
  }
}

function createNode(name, props = {}) {
  let children = props.children || [];
  return {
    name,
    parentNode: props.parentNode,
    fullyQualifiedName: props.fullyQualifiedName,
    category: props.category,
    getChildren(params = {}) {
      const { category, blacklist } = params;
      let _children = children;
      if (blacklist) {
        _children = _children.filter(tag => !isOnBlacklist(tag, blacklist));
      }
      if (category) {
        _children = _children.filter(tag => tag.category === category);
      }
      return _children;
    },
    addChild(child) {
      children.push(child);
    }
  };
}

export function findSubTreeByFullyQualifiedName(fullyQualifiedName) {
  getTagTree();
  return tagMap[fullyQualifiedName];
}

export function getTreeNodesTillName(name) {
  const treeNode = findSubTreeByFullyQualifiedName(name);
  if (!treeNode) {
    return null;
  }

  const nodesTillRoot = [];
  let nodeCursor = treeNode;
  while (nodeCursor) {
    if (nodeCursor.parentNode) {
      nodesTillRoot.push(nodeCursor);
    }
    nodeCursor = nodeCursor.parentNode;
  }
  return nodesTillRoot.reverse();
}

export function getFullPathTillNode(node, name) {
  let cursor = node.parentNode;
  while (cursor) {
    if (cursor && cursor.parentNode) {
      if (name) {
        name = `${cursor.name}.${name}`;
      } else {
        name = cursor.name;
      }
    }
    cursor = cursor.parentNode;
  }
  return name;
}

export function getDeepestPossibleNodePath({ name, filtered = false, filterbyCategory, blacklist }) {
  let cursor = findSubTreeByFullyQualifiedName(name);
  while (cursor) {
    const children = filtered
      ? cursor.getChildren({ blacklist: blacklist, category: filterbyCategory })
      : cursor.getChildren();
    if (children.length !== 1) {
      break;
    }

    cursor = children[0];
    name = `${name}.${cursor.name}`;
  }
  return name;
}

export function findChildByName(node, childName) {
  if (!node) {
    return null;
  }
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.name === childName) {
      return child;
    }
  }
  return null;
}

const tagCategories = ['CALL', 'CLOUD', 'CONTAINER', 'SYSTEM', 'LANGUAGE', 'FRAMEWORK', 'DATABASE', 'MESSAGING'];
export function getTagCategories() {
  return tagCategories;
}

const blacklists = {
  generalBlacklist: {
    'application.id': true,
    'service.id': true,
    'endpoint.id': true,
    'host.snapshotId': true,
    'docker.snapshotId': true,
    'process.snapshotId': true
  },

  customFilterBlacklist: {
    application: true,
    'application.name': true,
    service: true,
    'service.name': true,
    endpoint: true,
    'endpoint.name': true
  }
};
export function getCustomFilterBlacklist() {
  return blacklists.customFilterBlacklist;
}
export function getApplicationCreationFilterBlacklist() {
  if (!blacklists.applicationCreationFilterBlacklist) {
    blacklists.applicationCreationFilterBlacklist = {};

    const manualAddedTags = {
      'host.mac': true,
      'docker.container.name': true,
      'call.technology': true,
      'aws.service.type': true,
      'application.id': true,
      'application.name': true
    };

    getTagTree();
    const keys = Object.keys(tagMap);
    for (let i = 0; i < keys.length; i++) {
      const tag = tagMap[keys[i]];
      if (
        (tag.type &&
          tag.type !== TAG_TYPES.STRING.technicalName &&
          tag.type !== TAG_TYPES.KEY_VALUE_PAIR.technicalName) ||
        tag.category === 'INSTANA' ||
        manualAddedTags[tag.fullyQualifiedName]
      ) {
        blacklists.applicationCreationFilterBlacklist[tag.fullyQualifiedName] = true;

        const isParentNodeLeftWithZeroChildren =
          tag.parentNode.getChildren({ blacklist: blacklists.applicationCreationFilterBlacklist }).length === 0;
        if (isParentNodeLeftWithZeroChildren) {
          blacklists.applicationCreationFilterBlacklist[tag.parentNode.fullyQualifiedName] = true;
        }
      }
    }
  }

  return blacklists.applicationCreationFilterBlacklist;
}
