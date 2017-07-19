import React from 'react';

import { msTwoDecimalPlaces, zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import WebsiteHeader from 'in-views/eumView/components/WebsiteHeader';
import { createStore } from 'in-components/Table/stores/content';
import WebsiteRow from 'in-views/eumView/components/WebsiteRow';
import { goToDashboard } from 'in-stores/navigation';
import './WebsiteTable.less';

const columnDefinitions = [
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
    title: 'Load Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'duration.mean';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Views',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Uncaught Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'uncaughtErrors';
      },
      getContent: twoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const header = {
  websiteName: {
    name: 'Name',
    index: 0,
    sortDirection: 0
  },
  websiteKpis: [
    {
      index: 1,
      name: 'Views',
      sortDirection: 0
    },
    {
      index: 2,
      name: 'Load Time',
      sortDirection: 0
    },
    {
      index: 3,
      name: 'Uncaught Errors',
      sortDirection: 0
    }
  ]
};

const block = 'in-website-table';

export default class WebsiteTable extends React.Component {
  displayName = 'WebsiteTable';

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    this.newStore(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.snapshots !== nextProps.snapshots) {
      this.store.onRowChange(this.getRows(nextProps.snapshots));
    }
  }

  newStore(props) {
    this.store = createStore({
      columnDefinitions,
      maxItemsPerPage: Number.MAX_VALUE,
      initialSortColumn: 0,
      initialSortDirection: 'asc'
    });
    this.store.onRowChange(this.getRows(props.snapshots));
    this.dataSubscription = this.store.sortedPagedData$.subscribe(data => this.setState({ data }));
  }

  dispose() {
    if (this.dataSubscription) {
      this.dataSubscription.dispose();
    }
    if (this.store) {
      this.store.dispose();
      this.store = null;
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  getRows = snapshots => {
    return snapshots.map(snapshot => {
      return {
        key: snapshot.get('id'),
        label: snapshot.get('label'),
        snapshot
      };
    });
  };

  render() {
    const { data } = this.state;
    if (!data) {
      return null;
    }

    return (
      <div className={block}>
        <WebsiteHeader
          data={header}
          sortColumnIndex={data.sortColumnIndex}
          sortDirection={data.sortDirection}
          onChangeSort={this.store.setSort}
        />
        {data.rows.map(row => {
          const columns = row.columns;
          return (
            <WebsiteRow
              key={row.key}
              columns={row.columns}
              data={{
                name: columns[0].value,
                loadTime: columns[1].content,
                pageLoad: columns[2].content,
                errors: columns[3].content
              }}
              onClick={e => {
                e.preventDefault();
                goToDashboard(row.key);
              }}
            />
          );
        })}
      </div>
    );
  }
}
