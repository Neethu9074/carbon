import React from 'react';

import { zeroDecimalPlaces, milliSecondsToSecondsTwoDecimalPlace } from 'in-services/formatters/number';
import WebsiteHeader from 'in-views/eumView/components/WebsiteHeader';
import { createStore } from 'in-components/Table/stores/content';
import WebsiteRow from 'in-views/eumView/components/WebsiteRow';

import './WebsiteTable.less';

const block = 'in-website-table';

const columnDefinitions = [
  {
    title: 'Name',
    type: 'string',
    index: 0,
    typeArgs: {
      getValue(row) {
        return row.label;
      }
    }
  },
  {
    title: 'Views',
    type: 'metric',
    index: 1,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: 'Load Time',
    type: 'metric',
    index: 2,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'duration.mean';
      },
      getContent: milliSecondsToSecondsTwoDecimalPlace,
      getTimeWindowAggregation() {
        return 'mean';
      },
      forceTimeWindowAggregation: true
    }
  }
];

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
      maxItemsPerPage: 10,
      initialSortColumn: 1,
      initialSortDirection: 'desc'
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
          columnDefinitions={columnDefinitions}
          sortColumnIndex={data.sortColumnIndex}
          sortDirection={data.sortDirection}
          onChangeSort={this.store.setSort}
          data={data}
          onPrevPage={this.store.onPrevPage}
          onNextPage={this.store.onNextPage}
        />

        {data.rows.length === 0
          ? <div className={`${block}__no-websites-matching-query`}>
              No websites found for your current query.
            </div>
          : null}

        {data.rows.map(row => {
          const columns = row.columns;
          return (
            <WebsiteRow
              key={row.key}
              columns={row.columns}
              snapshot={row.rowConfig.snapshot}
              data={{
                name: columns[0].value,
                pageLoad: columns[1].content,
                loadTime: columns[2].content
              }}
            />
          );
        })}
      </div>
    );
  }
}
