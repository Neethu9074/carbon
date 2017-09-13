import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import KubernetesHeader from 'in-views/kubernetesView/components/KubernetesHeader';
import { createStore } from 'in-components/Table/stores/content';
import KubernetesClusterRow from 'in-views/kubernetesView/components/KubernetesClusterRow';

import './KubernetesClusterTable.less';

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
    title: 'Nodes',
    type: 'number',
    index: 1,
    typeArgs: {
      getContent: zeroDecimalPlaces,
      getValue(row) {
        return row.snapshot.getIn(['data', 'nodes', 'itemIds']).size;
      }
    }
  },
  {
    title: 'Available Replicas',
    type: 'metric',
    index: 2,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'availableReplicas';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: 'Desired Replicas',
    type: 'metric',
    index: 3,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot.get('id');
      },
      getMetricName() {
        return 'replicas';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      forceTimeWindowAggregation: true
    }
  }
];

export default class KubernetestClusterTable extends React.Component {
  displayName = 'KubernetestClusterTable';

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      filter: ''
    };
  }

  componentDidMount() {
    this.newStore(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.snapshots !== nextProps.snapshots || this.props.snapshot !== nextProps.snapshot) {
      this.store.onRowChange(this.getRows(nextProps.snapshots, nextProps.snapshot));
    }
  }

  newStore(props) {
    this.store = createStore({
      columnDefinitions,
      maxItemsPerPage: 10,
      initialSortColumn: 1,
      initialSortDirection: 'desc'
    });
    this.store.onRowChange(this.getRows(props.snapshots, props.snapshot));
    this.dataSubscription = this.store.sortedPagedData$.subscribe(data => this.setState({ data }));
    this.filterSubscription = this.store.filter$.subscribe(filter => this.setState({ filter }));
  }

  dispose() {
    if (this.dataSubscription) {
      this.dataSubscription.dispose();
    }
    if (this.filterSubscription) {
      this.filterSubscription.dispose();
    }
    if (this.store) {
      this.store.dispose();
      this.store = null;
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  getRows = (snapshots, snapshot) => {
    if (snapshots) {
      return snapshots.map(snapshot => {
        return {
          key: snapshot.get('id'),
          label: snapshot.get('label'),
          snapshot
        };
      });
    }

    const hashes = snapshot.getIn(['data', 'service_endpoint_hashes']);
    const rows = [];
    snapshot.getIn(['data', 'service_endpoints']).toArray().forEach((pageName, i) => {
      // protect against missing data
      if (!hashes || !hashes.get(i)) {
        return;
      }
      const pageHash = hashes.get(i);
      rows.push({
        key: pageHash,
        label: pageName,
        snapshot,
        isPage: true,
        pageHash
      });
    });
    return rows;
  };

  render() {
    const { data, filter } = this.state;
    if (!data) {
      return null;
    }

    return (
      <div className={block}>
        <KubernetesHeader
          columnDefinitions={columnDefinitions}
          sortColumnIndex={data.sortColumnIndex}
          sortDirection={data.sortDirection}
          onChangeSort={this.store.setSort}
          data={data}
          onPrevPage={this.store.onPrevPage}
          onNextPage={this.store.onNextPage}
          filter={filter}
          setFilter={this.store.setFilter}
          showFilter={this.props.showFilter}
        />

        {data.rows.length === 0
          ? <div className={`${block}__no-websites-matching-query`}>
              {'No Kubernetes clusters found for your current query.'}
            </div>
          : null}

        {data.rows.map(row => {
          const columns = row.columns;
          return (
            <KubernetesClusterRow
              key={row.key}
              columns={row.columns}
              snapshot={row.rowConfig.snapshot}
              isPage={row.rowConfig.isPage}
              metricPrefix={row.rowConfig.isPage ? `endpoint.${row.rowConfig.label}.` : ''}
              pageHash={row.rowConfig.pageHash}
              data={{
                name: columns[0].value,
                nodes: columns[1].content,
                availableReplicas: columns[1].value,
                replicas: columns[2].content
              }}
            />
          );
        })}
      </div>
    );
  }
}
