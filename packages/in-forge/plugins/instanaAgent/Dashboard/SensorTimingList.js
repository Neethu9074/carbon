/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { nanos, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.operation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.count'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.count;
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.slow'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.slow;
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.min'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.min;
      },
      getContent: nanos.compact
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.avg'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.avg;
      },
      getContent: nanos.compact
    }
  },
  {
    title: t('in-forge:plugins.instanaAgent.dashboard.max'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.max;
      },
      getContent: nanos.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'timings')
    };
  },
  function SensorTimingList({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const timings = data.get('raw_payload');
    if (timings.size === 0) {
      return null;
    }

    const timingsJS = timings.toJS();
    const rows = Object.keys(timingsJS).map(key => {
      var value = timingsJS[key];

      var min, avg, max, slow, count;
      slow = value.slow;
      count = value.count;
      min = value.min;
      if (Object.prototype.hasOwnProperty.call(value, 'max')) {
        max = value.max;
        avg = value.avg;
      } else {
        max = min;
        avg = min;
      }

      return {
        key,
        count,
        slow,
        min,
        avg,
        max
      };
    });

    return (
      <Table
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.instanaAgent.dashboard.sensorTimings30SWindow')}
            timestamp={data.get('timestamp')}
          />
        }
        withoutPadding
        cols={cols}
        rows={rows}
        initialSortColumn={3}
        initialSortDirection="desc"
      />
    );
  }
);
