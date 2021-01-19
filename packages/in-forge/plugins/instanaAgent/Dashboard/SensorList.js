/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import connectTo from 'in-hoc/connectTo';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';

const cols = [
  {
    title: 'Name',
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
    title: 'Usage Count',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.usage;
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'sensors')
    };
  },
  function SensorList({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const sensors = data.get('raw_payload');
    if (sensors.size === 0) {
      return null;
    }

    const rows = sensors.toJS().map(sensor => {
      return {
        key: sensor.name,
        usage: sensor.usage
      };
    });

    return (
      <Table
        cardTitle={<TimeOfLastUpdateCardTitle title="Sensor List" timestamp={data.get('timestamp')} />}
        withoutPadding
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="desc"
      />
    );
  }
);
