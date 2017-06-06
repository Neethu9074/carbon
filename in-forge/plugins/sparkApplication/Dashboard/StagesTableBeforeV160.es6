import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { bytesTwoDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyMap } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Id',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('id');
      },
      getContent: function(value) {
        return value;
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.stage.get('name');
      }
    }
  },
  {
    title: 'Submission Time',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('submissionTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: 'Duration',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('duration');
      },
      getContent: timeByMillisTwoDecimalPlaces
    }
  },
  {
    title: 'Tasks',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('tasks');
      },
      getContent: function(value) {
        return value;
      }
    }
  },
  {
    title: 'Input Bytes',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('inputBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Output Bytes',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('outputBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Shuffle Read',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('shuffleRead');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Shuffle Write',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.stage.get('shuffleWrite');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default function StagesTable({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const stages = data.get('stages', emptyMap);
  if (stages.size === 0) {
    return null;
  }

  const rows = stages
    .map(stage => {
      return {
        key: String(stage.get('id')),
        stage,
        snapshotId: snapshot.get('id'),
        timeframe
      };
    })
    .toArray();

  return (
    <DashboardSection title={`Top Longest Completed Stages`}>
      <Table cols={cols} rows={rows} initialSortColumn={3} initialSortDirection={'desc'} />
    </DashboardSection>
  );
}
