import React from 'react';

import connectTo from 'in-hoc/connectTo';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { nanos } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';

const cols = [
  {
    title: 'Operation',
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
    title: 'Min',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.min;
      },
      getContent: nanos.compact
    }
  },
  {
    title: 'Avg',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.avg;
      },
      getContent: nanos.compact
    }
  },
  {
    title: 'Max',
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
      var min, avg, max;
      if (typeof value === 'number') {
        min = value;
        max = min;
        avg = min;
      } else {
        var values = value.split(':');
        min = Number(values[0]);
        avg = Number(values[1]);
        max = Number(values[2]);
      }

      return {
        key,
        min,
        avg,
        max
      };
    });

    return (
      <Table
        cardTitle={<TimeOfLastUpdateCardTitle title="Sensor timings" timestamp={data.get('timestamp')} />}
        withoutPadding
        cols={cols}
        rows={rows}
        initialSortColumn={3}
        initialSortDirection="desc"
      />
    );
  }
);
