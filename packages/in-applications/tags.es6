import { get } from 'lodash';
import React from 'react';

import { compareIgnoreCase } from 'in-services/util/string';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { deepCopy } from 'in-services/util/object';

const customServiceMappingTagKeys = [
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
  return [{ value: '', label: 'Please select' }]
    .concat(customServiceMappingTagKeys.map(key => ({ label: key, value: key })))
    .map(tag => (
      <option key={tag.label} value={tag.value}>
        {tag.label}
      </option>
    ));
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

export function getTagMap() {
  if (tagMap == null) {
    buildTagTree();
  }

  return tagMap;
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

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    const node = createNode(tag.name, {
      fullyQualifiedName: tag.name,
      rootNode
    });

    tagMap[node.fullyQualifiedName] = node;
    node.type = tag.type;
    rootNode.addChild(node);
  }
}

function createNode(name, props = {}) {
  let children = props.children || [];
  return {
    name,
    parentNode: props.parentNode,
    fullyQualifiedName: props.fullyQualifiedName,
    getChildren(params = {}) {
      const { blacklist } = params;
      let _children = children;
      if (blacklist) {
        _children = _children.filter(tag => !isOnBlacklist(tag, blacklist));
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

const blacklists = {
  generalBlacklist: {
    'application.id': true,
    'service.id': true,
    'endpoint.id': true,
    'process.id': true,
    'docker.container.id': true,
    'host.snapshotId': true,
    'docker.snapshotId': true,
    'process.snapshotId': true
  },
  callGroupBlacklist: {
    'trace.id': true,
    'trace.name': true,
    'trace.latency': true,
    'trace.erroneous': true
  }
};

export const callGroupBlacklist = blacklists.callGroupBlacklist;

export function getApplicationCreationFilterBlacklist() {
  if (!blacklists.applicationCreationFilterBlacklist) {
    blacklists.applicationCreationFilterBlacklist = {};

    const manualAddedTags = {
      'host.mac': true,
      'docker.container.name': true,
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
        manualAddedTags[tag.fullyQualifiedName]
      ) {
        blacklists.applicationCreationFilterBlacklist[tag.fullyQualifiedName] = true;
      }
    }
  }

  return blacklists.applicationCreationFilterBlacklist;
}

export function getTagFromList(tagFilter, _tag) {
  for (let i = 0; i < tagFilter.length; i++) {
    const tag = tagFilter[i];
    if (_tag.name && _tag.name !== tag.name) {
      continue;
    }
    if (_tag.value && _tag.value !== tag.value) {
      continue;
    }
    if (_tag.operator && _tag.operator !== tag.operator) {
      continue;
    }

    return tag;
  }

  return null;
}

export function getMultipleTagFromList(tagFilter, _tag) {
  const result = [];

  for (let i = 0; i < tagFilter.length; i++) {
    const tag = tagFilter[i];
    if (_tag.name && _tag.name !== tag.name) {
      continue;
    }
    if (_tag.value && _tag.value !== tag.value) {
      continue;
    }
    if (_tag.operator && _tag.operator !== tag.operator) {
      continue;
    }

    result.push(tag);
  }

  return result;
}

export function getKeyValuePairTag(_tag) {
  const tagMap = getTagMap();
  const tags = Object.keys(tagMap).map(key => tagMap[key]);
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
      if (_tag.indexOf(tag.fullyQualifiedName) === 0) {
        return tag;
      }
    }
  }
  return null;
}
