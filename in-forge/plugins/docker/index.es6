import tableDefinition from 'in-forge/plugins/docker/tableDefinition';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.docker,

  iconSvgPath,
  metricDefinitions,
  tableDefinition,
  namesForTypeSearch: ['docker'],

  pluginName: {
    singular: 'Docker Container',
    plural: 'Docker Containers'
  },

  getLabel(s) {
    const podName = s.getIn(['data', 'Labels', 'io.kubernetes.pod.name']);
    if (podName) {
      return podName;
    }

    const marathonAppName = s.getIn(['data', 'Marathon', 'appId']);
    if (marathonAppName) {
      return marathonAppName;
    }

    const nomadTaskName = s.getIn(['data', 'Nomad', 'taskName']);
    if (nomadTaskName) {
      return nomadTaskName;
    }

    const ecsContainerName = s.getIn(['data', 'Labels', 'com.amazonaws.ecs.container-name']);
    if (ecsContainerName) {
      return ecsContainerName;
    }

    const image = s.getIn(['data', 'Image']);
    if (!image) {
      return getFallbackLabel(s);
    }
    const match = image.match(/(^|\/)(([^\/]+)\/)?([^\/:]+)([^/]*)$/);
    if (!match) {
      return getFallbackLabel(s);
    }

    let label = match[4];
    if (match[3]) {
      label = `${match[3]}/${match[4]}`;
    }
    if (match[5]) {
      label += `${match[5]}`;
    }
    return label;
  }
});

function getFallbackLabel(s) {
  const names = s.getIn(['data', 'Names']);
  return names ? names.join(', ') : undefined;
}
