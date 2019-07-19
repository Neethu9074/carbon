import { get } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
import { deepCopy } from 'in-services/util/object';
import { isInstanaEngineer } from 'in-stores/user';

export const customServiceMappingTagKeys = [
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

export const callAnalysisBlacklistedTags = [
  'trace.id',
  'trace.name',
  'trace.endpoint.name',
  'trace.service.name',
  'trace.latency',
  'trace.erroneous'
];

const blacklists = {
  generalBlacklist: (() => {
    const blacklist = {
      'application.id': true,
      'source.application.id': true,
      'service.id': true,
      'source.service.id': !isInstanaEngineer,
      'endpoint.id': true,
      'source.endpoint.id': true,
      'source.endpoint.name': !isInstanaEngineer,
      'source.endpoint.type': true,
      'process.id': true,
      'docker.container.id': true,
      'host.snapshotId': !isInstanaEngineer,
      'container.snapshotId': !isInstanaEngineer,
      'process.snapshotId': !isInstanaEngineer,
      'cluster.snapshotId': !isInstanaEngineer,
      'call.span_type': !isInstanaEngineer,
      'call.processing_errors': !isInstanaEngineer,
      'service.rule_id': !isInstanaEngineer,
      'source.service.rule_id': !isInstanaEngineer
    };
    return tag => blacklist[tag];
  })(),
  callGroupBlacklist: (() => {
    const blacklist = callAnalysisBlacklistedTags.reduce((agg, k) => {
      agg[k] = true;
      return agg;
    }, {});
    return tag => blacklist[tag] || isBeaconTag(tag);
  })(),
  analyzeFilterBlacklist: isBeaconTag
};

function isBeaconTag(tag) {
  return tag.indexOf('beacon.') === 0;
}

const latencyTags = ['call.latency', 'trace.latency', 'beacon.duration'];
export function isLatencyTag(tag) {
  return latencyTags.includes(tag);
}

export const getTraceGroupTagKeys = () => ['trace.endpoint.name', 'trace.service.name'];

export const getCallGroupTagKeys = () =>
  getTagTree()
    .getChildren({ blacklist: blacklists.callGroupBlacklist })
    .map(node => node.name);

export const getAnalyzeFilterTagKeys = () =>
  getTagTree()
    .getChildren({ blacklist: blacklists.analyzeFilterBlacklist })
    .map(node => node.name);

export function getApplicationCreationTagKeys() {
  const applicationCreationBlacklist = {
    'host.mac': true,
    'docker.container.name': true,
    'aws.service.type': true,
    'application.id': true,
    'application.name': true,
    'call.name': true,
    'trace.id': true,
    'trace.service.name': true,
    'trace.endpoint.name': true,
    'trace.name': true,
    'log.level': true,
    'log.message': true,
    'call.error.message': true,
    'cf.container.garden.id': true
  };
  getTagTree();
  let tagKeys = [];
  const keys = Object.keys(tagMap);
  for (let i = 0; i < keys.length; i++) {
    const tag = tagMap[keys[i]];
    if (
      tag.type &&
      (tag.type === TAG_TYPES.STRING.technicalName || tag.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) &&
      !applicationCreationBlacklist[tag.fullyQualifiedName] &&
      !isBeaconTag(tag.fullyQualifiedName)
    ) {
      tagKeys.push(tag.fullyQualifiedName);
    }
  }
  return tagKeys;
}

function isOnBlacklist(serverTag, blacklist) {
  return blacklist(serverTag.fullyQualifiedName) || blacklist(serverTag.name);
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

export function requiresSecondLevelName(fullyQualifiedName) {
  const node = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  return node && node.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName;
}

export function getTagType(fullyQualifiedName) {
  const definition = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  return definition ? definition.type : null;
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
