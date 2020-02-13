import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import KeyValue, { themes } from 'in-new-components/lists/KeyValue';
import { formatDateTime } from 'in-services/formatters/date';
import { percentage } from 'in-services/formatters/number';
import { getLabel } from 'in-sdk/snapshot';

export default {
  host: [
    {
      id: 'label',
      label: 'Name',
      getContent(snapshot) {
        return <KeyValue label="Name" value={getLabel(snapshot)} inverted accentuated />;
      }
    },
    {
      id: 'os',
      label: 'OS',
      getContent(snapshot) {
        const data = snapshot.get('data');
        return (
          <KeyValue
            label="OS"
            value={`${snapshot.getIn(['data', 'os.version'])} (${data.get('os.arch', '')})`}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      id: 'cpuCount',
      label: 'CPU Count',
      getContent(snapshot) {
        return (
          <KeyValue label="# of CPUs" value={snapshot.getIn(['data', 'cpu.count'])} theme={themes.blue} accentuated />
        );
      }
    },
    {
      id: 'cpuUsage',
      label: 'CPU Usage',
      getContent(snapshot) {
        return (
          <LabeledSparkChart
            snapshotId={snapshot.get('id')}
            metric={{ label: 'CPU Usage', metric: 'cpu.used', aggregation: 'mean', formatter: percentage }}
          />
        );
      }
    }
  ],
  docker: [
    {
      id: 'label',
      label: 'Name',
      getContent(snapshot) {
        return <KeyValue label="Name" value={getLabel(snapshot)} inverted accentuated />;
      }
    },
    {
      id: 'created',
      label: 'Created',
      getContent(snapshot) {
        return (
          <KeyValue
            label="Created"
            value={formatDateTime(snapshot.getIn(['data', 'Created']))}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      id: 'started',
      label: 'Started',
      getContent(snapshot) {
        return (
          <KeyValue
            label="Started"
            value={formatDateTime(snapshot.getIn(['data', 'Started']))}
            theme={themes.blue}
            accentuated
          />
        );
      }
    },
    {
      id: 'cpuUsage',
      label: 'CPU Usage',
      getContent(snapshot) {
        return (
          <LabeledSparkChart
            snapshotId={snapshot.get('id')}
            metric={{ label: 'CPU Usage', metric: 'cpu.total_usage', aggregation: 'mean', formatter: percentage }}
          />
        );
      }
    }
  ],
  process: [
    {
      id: 'label',
      label: 'Name',
      getContent(snapshot) {
        return <KeyValue label="Name" value={getLabel(snapshot)} inverted accentuated />;
      }
    },
    {
      id: 'cpuUser',
      label: 'CPU User',
      getContent(snapshot) {
        return (
          <LabeledSparkChart
            snapshotId={snapshot.get('id')}
            metric={{ label: 'CPU User', metric: 'cpu.user', aggregation: 'mean', formatter: percentage }}
          />
        );
      }
    }
  ]
};
