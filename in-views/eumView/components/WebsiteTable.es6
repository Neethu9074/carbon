import React from 'react';

import WebsiteHeader from 'in-views/eumView/components/WebsiteHeader';
import { createStore } from 'in-components/Table/stores/content';
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
const columnDefinitions = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.label;
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
      name: 'Page Load',
      sortDirection: 0
    },
    {
      index: 2,
      name: 'Load Time',
      sortDirection: 0
    },
    {
      index: 3,
      name: 'Errors',
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
          return (
            <WebsiteRow
              key={row.key}
              snapshot={row.rowConfig.snapshot}
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
