/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import moment from 'moment';

import { TAG_TYPES, entityTypes } from 'in-analyze/applicationFilter';
import { compareIgnoreCase } from 'in-services/util/string';
import { deepCopy } from 'in-services/util/object';
import { isInstanaEngineer } from 'in-stores/user';

export const customServiceMappingTagKeys = [
  'agent.tag',
  'cassandra.cluster.name',
  'cloudfoundry.application.id',
  'cloudfoundry.application.name',
  'cloudfoundry.organization.id',
  'cloudfoundry.organization.name',
  'cloudfoundry.space.id',
  'cloudfoundry.space.name',
  'container.name',
  'container.image.name',
  'container.label',
  'containerd.image.name',
  'containerd.label',
  'crio.container.name',
  'crio.image.name',
  'crio.label',
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
  // 'jvm.args' is not part of the backend (/api/tags) and therefore not present in the window.instana.tags
  // This is on purpose as the tag is only required for custom service mapping.
  'jvm.args',
  'kafka.cluster.name',
  'mongo.replicatSetName',
  'kubernetes.cluster.name',
  'kubernetes.container.name',
  'kubernetes.namespace',
  'kubernetes.label',
  'kubernetes.pod.label',
  'kubernetes.service.name',
  'lxc.name',
  'marathon.app.id',
  'nodejs.app.name',
  'nomad.job.name',
  'nomad.task.name',
  'process.name',
  'ruby.name',
  'service.default_name',
  'springboot.name',
  'tanzu.foundation.name'
];

export const callAnalysisDisabledTags = [
  'trace.id',
  'trace.name',
  'trace.endpoint.name',
  'trace.service.name',
  'trace.latency',
  'trace.erroneous',
  'call.inbound_of_application'
];

export const traceAnalysisDisabledTags = ['call.latency'];

const disabledLists = {
  general: (() => {
    const disabledList = {
      'application.id': !isInstanaEngineer,
      'boundary.application.id': !isInstanaEngineer,
      'service.id': !isInstanaEngineer,
      'service.rule_id': !isInstanaEngineer,
      'endpoint.id': !isInstanaEngineer,
      'endpoint.type': !isInstanaEngineer,
      'process.id': true,
      'docker.container.id': true,
      'containerd.container.id': true,
      'garden.container.id': true,
      'crio.container.id': true,
      'host.snapshotId': !isInstanaEngineer,
      'container.snapshotId': !isInstanaEngineer,
      'process.snapshotId': !isInstanaEngineer,
      'cluster.snapshotId': !isInstanaEngineer,
      'cloud.snapshotId': !isInstanaEngineer,
      'call.span_type': !isInstanaEngineer,
      'call.http.hostCapturedFromSource': !isInstanaEngineer,
      'call.meta_tags': !isInstanaEngineer,
      'call.ingestion_time': !isInstanaEngineer,
      'log.span_type': !isInstanaEngineer,
      'related.infra.entity.snapshotId': !isInstanaEngineer,
      'related.infra.entity.pluginId': !isInstanaEngineer,
      'eum.correlation.id': !isInstanaEngineer,
      'eum.correlation.type': !isInstanaEngineer,
      'trace.service.id': !isInstanaEngineer,
      'call.id': !isInstanaEngineer
    };
    return tag => disabledList[tag];
  })(),
  callGroup: (() => {
    const disabledList = callAnalysisDisabledTags.reduce((agg, k) => {
      agg[k] = true;
      return agg;
    }, {});
    return tag => disabledList[tag] || isBeaconTag(tag);
  })(),
  analyzeFilter: isBeaconTag
};

function isBeaconTag(tag) {
  return tag.indexOf('beacon.') === 0 || tag.indexOf('mobileBeacon.') === 0;
}

const latencyTags = ['call.latency', 'trace.latency', 'beacon.duration'];
export function isLatencyTag(tag) {
  return latencyTags.includes(tag);
}

export const getTraceGroupTagKeys = () => ['trace.endpoint.name', 'trace.service.name'];

export const getCallGroupTagKeys = () =>
  getTagTree()
    .getChildren({ isTagOnDisabledList: disabledLists.callGroup })
    .map(node => node.name);

export const getAnalyzeFilterTagKeys = () =>
  getTagTree()
    .getChildren({ isTagOnDisabledList: disabledLists.analyzeFilter })
    .map(node => node.name);

export function getApplicationCreationTagKeys() {
  const applicationCreationDisabledlist = {
    'host.mac': true,
    'docker.container.name': true,
    'crio.container.name': true,
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
    'cloudfoundry.container.garden.id': true
  };
  getTagTree();
  let tagKeys = [];
  const keys = Object.keys(tagMap);
  for (let i = 0; i < keys.length; i++) {
    const tag = tagMap[keys[i]];
    if (
      tag.type &&
      (tag.type === TAG_TYPES.STRING.technicalName ||
        tag.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName ||
        tag.name === 'call.http.status') &&
      !applicationCreationDisabledlist[tag.fullyQualifiedName] &&
      !isBeaconTag(tag.fullyQualifiedName)
    ) {
      tagKeys.push(tag.fullyQualifiedName);
    }
  }
  return tagKeys;
}

function isDisabled(serverTag, isTagOnDisabledList) {
  return isTagOnDisabledList(serverTag.fullyQualifiedName) || isTagOnDisabledList(serverTag.name);
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
    .filter(tag => !isDisabled(tag, disabledLists.general))
    .sort((a, b) => compareIgnoreCase(a.name, b.name));

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    const node = createNode(tag.name, {
      fullyQualifiedName: tag.name,
      rootNode
    });

    tagMap[node.fullyQualifiedName] = node;
    node.type = tag.type;
    node.canApplyToSource = tag.canApplyToSource;
    node.canApplyToDestination = tag.canApplyToDestination;
    node.sourceValueAvailableFrom = tag.sourceValueAvailableFrom;
    rootNode.addChild(node);
  }
}

function createNode(name, props = {}) {
  let children = props.children || [];
  return {
    name,
    parentNode: props.parentNode,
    fullyQualifiedName: props.fullyQualifiedName,
    getChildren({ isTagOnDisabledList } = {}) {
      let _children = children;
      if (isTagOnDisabledList) {
        _children = _children.filter(tag => !isDisabled(tag, isTagOnDisabledList));
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

export function getTagEntity(fullyQualifiedName) {
  const definition = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  if (definition && definition.canApplyToDestination && definition.canApplyToSource) {
    return entityTypes.SOURCE_AND_DESTINATION;
  } else if (definition && definition.canApplyToDestination && !definition.canApplyToSource) {
    return entityTypes.DESTINATION;
  } else if (definition && !definition.canApplyToDestination && definition.canApplyToSource) {
    return entityTypes.SOURCE;
  } else {
    return entityTypes.NOT_APPLICABLE;
  }
}

export function getSourceEntityAvailability(fullyQualifiedName, timeConfig) {
  const definition = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  const sourceEntityAvailability = definition ? definition.sourceValueAvailableFrom : null;

  const to = timeConfig.to || Date.now();
  const from = to - timeConfig.windowSize;

  if (moment(sourceEntityAvailability).isAfter(from)) {
    return false;
  }
  return true;
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

export function isIdTag(tagName) {
  return tagName.endsWith('.id') || tagName.endsWith('.snapshotId');
}
