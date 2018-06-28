import { assign } from 'lodash';
import React from 'react';

const tagKeys = [
  'cassandra.cluster.name',
  'docker.containerName',
  'docker.image',
  'docker.label',
  'dropwizard.name',
  'elasticsearch.cluster.name',
  'host.fqdn',
  'host.name',
  'host.os.name',
  'host.tag',
  'host.zone',
  'agent.zone',
  'ec2.zone',
  'azure.zone',
  'gce.zone',
  'nova.zone',
  'jvm.app.name',
  'kafka.cluster.name',
  'mongodb.cluster.name',
  'kubernetes.container.name',
  'kubernetes.pod.label',
  'marathon.appId',
  'nodejs.app.name',
  'nomad.jobName',
  'nomad.taskName',
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
    } else if (matchSpecification.key.indexOf('host.tag.') === 0) {
      matchSpecification.value = `${matchSpecification.key.slice('host.tag.'.length)}=${matchSpecification.value}`;
      matchSpecification.key = 'host.tag';
    }
  }

  return {
    id: config.id,
    label: config.label,
    name: config.name,
    matchSpecification: matchSpecificationCopy
  };
}

export function mapToServerResponse(config) {
  if (!config) {
    return config;
  }

  for (let i = 0; i < config.matchSpecification.length; i++) {
    const matchSpecification = config.matchSpecification[i];
    if (matchSpecification.key === 'docker.label') {
      const indexOfFirstEqual = matchSpecification.value.indexOf('=');
      const stringBeforeEqual = matchSpecification.value.slice(0, Math.max(0, indexOfFirstEqual));
      const stringAfterEqual = indexOfFirstEqual >= 0 ? matchSpecification.value.slice(indexOfFirstEqual + 1) : '';

      matchSpecification.key = `docker.label.${stringBeforeEqual}`;
      matchSpecification.value = stringAfterEqual;
    } else if (matchSpecification.key === 'kubernetes.pod.label') {
      const indexOfFirstEqual = matchSpecification.value.indexOf('=');
      const stringBeforeEqual = matchSpecification.value.slice(0, Math.max(0, indexOfFirstEqual));
      const stringAfterEqual = indexOfFirstEqual >= 0 ? matchSpecification.value.slice(indexOfFirstEqual + 1) : '';

      matchSpecification.key = `kubernetes.pod.label.${stringBeforeEqual}`;
      matchSpecification.value = stringAfterEqual;
    } else if (matchSpecification.key === 'host.tag') {
      const indexOfFirstEqual = matchSpecification.value.indexOf('=');
      const stringBeforeEqual = matchSpecification.value.slice(0, Math.max(0, indexOfFirstEqual));
      const stringAfterEqual = indexOfFirstEqual >= 0 ? matchSpecification.value.slice(indexOfFirstEqual + 1) : '';

      matchSpecification.key = `host.tag.${stringBeforeEqual}`;
      matchSpecification.value = stringAfterEqual;
    }
  }
  return config;
}
