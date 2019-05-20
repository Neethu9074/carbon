import { create, combineLatest } from 'reactive-observables';
import { fromJS } from 'immutable';
import React from 'react';

import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/timeline';
import http from 'in-services/http';

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
      .subscribe(matchingEntities => {
        this.props.onChange('matchingEntities', matchingEntities);
      });
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

function searchSnapshots(query, timeConfig, maxResults) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/snapshots`,
    queryParams: {
      time: timeConfig.to,
      from: timeConfig.from,
      to: timeConfig.to,
      q: query,
      size: maxResults,
      newApplicationModelEnabled: true
    }
  }).map(response => fromJS(response.body));
}

function getSnapshot(snapshotId, timeConfig) {
  return http({
    method: 'GET',
    url: `/api/snapshots/${encodeURIComponent(snapshotId)}`,
    maxRetries: 3,
    queryParams: {
      time: timeConfig.to
    }
  }).map(response => fromJS(response.body));
}

function search(query) {
  return timeConfig$
    .flatMap(timeConfig => {
      return searchSnapshots(query, timeConfig, 100).map(snapshotIds => {
        return { snapshotIds, timeConfig };
      });
    })
    .flatMap(result => {
      return combineLatest(
        result.snapshotIds.toArray().map(snapshotId => getSnapshot(snapshotId, result.timeConfig))
      ).map(snapshots => {
        return { snapshots: snapshots, snapshotIds: result.snapshotIds, query: query };
      });
    })
    .startWith({
      query
    });
}
