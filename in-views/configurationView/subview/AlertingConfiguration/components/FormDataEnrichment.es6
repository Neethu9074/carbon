import { combineLatest, create } from 'reactive-observables';
import React from 'react';

import createSearchObservable from 'in-services/subscription/search';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';

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
        if (!`${query}`) {
          return search('');
        } else {
          return search(`${query}`);
        }
      })
      .subscribe(matchingEntities => this.props.onChange('matchingEntities', matchingEntities));
  }

  componentWillUpdate(nextProps) {
    this.debouncedQuery.emit(nextProps.form.get('query').value);
  }

  shouldComponentUpdate(nextProps) {
    const prevQuery = this.props.form.get('query').value;
    const nextQuery = nextProps.form.get('query').value;
    if (prevQuery !== nextQuery) {
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
      view: 'TABLE',
      timeframe
    });
  });
}
