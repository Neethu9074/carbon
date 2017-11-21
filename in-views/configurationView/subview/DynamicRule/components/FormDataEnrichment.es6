import { combineLatest, create } from 'reactive-observables';
import React from 'react';

import createSearchObservable from 'in-services/subscription/search';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { getSnapshots } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';

export default class FormDataEnrichment extends React.Component {
  static displayName = 'FormDataEnrichment';

  state = {
    matchingEntities: null
  };

  debouncedQuery = create();
  subscription = null;

  componentWillMount() {
    this.debouncedQuery.emit(this.props.form.get('query').value);
    this.subscription = this.debouncedQuery
      .debounce(1000)
      .flatMap(query => {
        const entityType = this.props.form.get('entityType').value;
        if (!entityType) {
          return alwaysNull;
        }
        if (!`${query}`) {
          return search(`entity.pluginId:${entityType}`);
        } else {
          return search(`entity.pluginId:${entityType} AND (${query})`);
        }
      })
      .subscribe(matchingEntities => this.props.onChange('matchingEntities', matchingEntities));
  }

  componentWillUpdate(nextProps) {
    this.debouncedQuery.emit(nextProps.form.get('query').value);
  }

  shouldComponentUpdate(nextProps) {
    const prevEntityType = this.props.form.get('entityType').value;
    const prevQuery = this.props.form.get('query').value;
    const nextEntityType = nextProps.form.get('entityType').value;
    const nextQuery = nextProps.form.get('query').value;
    if (prevQuery !== nextQuery || prevEntityType !== nextEntityType) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  }

  render() {
    return null;
  }
}

function search(query) {
  return combineLatest([timeframe$, focusedMoment$]).flatMap(([timeframe, focusedMoment]) => {
    return createSearchObservable({
      query,
      time: focusedMoment,
      view: 'LOGICAL',
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
