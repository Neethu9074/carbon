import React from 'react';

import WebsiteHeader from 'in-views/eumView/components/WebsiteHeader';
import WebsiteRow from 'in-views/eumView/components/WebsiteRow';
import { goToDashboard } from 'in-stores/navigation';

//import { msTwoDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import './WebsiteTable.less';

/*const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.label;
      }
    }
  },
  {
    title: 'Page Views',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'count';
      },
      getContent: twoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Page Load',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'duration.95th';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Front End Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'fro';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Back End Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'bac';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'First Paint Time',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'fp';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
*/
const header = {
  websiteName: {
    name: 'Name',
    sortDirection: 0
  },
  websiteKpis: [
    {
      name: 'Page Load',
      sortDirection: 0
    },
    {
      name: 'Load Time',
      sortDirection: 0
    },
    {
      name: 'Errors',
      sortDirection: 0
    }
  ]
};

export default function WebsiteTable({ snapshots }) {
  /*let rows = snapshots.map(snapshot => {
      const snapshotId = snapshot.get('id');
      const label = getLabel(snapshot);
      return {
        key: snapshotId,
        label: label,
        snapshotId: snapshotId,
        snapshot
      };
    });*/

  return (
    <div>
      <WebsiteHeader data={header} />
      {snapshots.map(snapshot => {
        return (
          <WebsiteRow
            snapshot={snapshot}
            onClick={e => {
              e.preventDefault();
              goToDashboard(snapshot.get('id'));
            }}
          />
        );
      })}
    </div>
  );
}
