import { combineLatest, create } from 'reactive-observables';
import React from 'react';

import createSearchObservable from 'in-services/subscription/search';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { getSnapshots } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import Table from 'in-sdk/components/dashboard/Table';

import './MatchingEntityTable.less';

const block = 'in-dynamic-rule-dialog-matchin-entities-table';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshot(row) {
        return row.snapshot;
      }
    }
  }
];

export default class MatchingEntityTable extends React.Component {
  static displayName = 'MatchingEntityTable';

  state = {
    matchingEntities: null
  };

  debouncedQuery = create();
  subscription = null;

  componentWillMount() {
    this.debouncedQuery.emit(this.props.query);
    this.subscription = this.debouncedQuery
      .debounce(1000)
      .flatMap(query => {
        if (!this.props.entityType) {
          return alwaysNull;
        }
        query = query || '';
        return search(`entity.pluginId:${this.props.entityType} ${query}`);
      })
      .subscribe(matchingEntities => this.setState({ matchingEntities }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.query !== nextProps.query || this.props.entityType !== nextProps.entityType) {
      this.debouncedQuery.emit(nextProps.query);
    }

    if (this.state.matchingEntities === nextState.matchingEntities) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  }

  render() {
    const matchingEntities = this.state.matchingEntities;
    let rows;
    if (matchingEntities && matchingEntities.snapshots) {
      rows = matchingEntities.snapshots.map(snapshot => {
        return {
          key: snapshot.get('id'),
          snapshot
        };
      });
    } else {
      rows = [];
    }

    return (
      <div className={block}>
        <Table cols={cols} rows={rows} maxItemsPerPage={10} />
      </div>
    );
  }
}

function search(query) {
  return combineLatest([timeframe$, focusedMoment$]).flatMap(([timeframe, focusedMoment]) => {
    return createSearchObservable({
      query,
      time: focusedMoment,
      view: 'TABLE',
      timeframe
    })
      .flatMap(snapshotIds => {
        return getSnapshots(snapshotIds, focusedMoment).map(snapshots => {
          return {
            snapshots,
            snapshotIds,
            query
          };
        });
      })
      .startWith({
        query
      });
  });
}
