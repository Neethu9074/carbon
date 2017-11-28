import { create } from 'reactive-observables';
import React from 'react';

// import getEventsInTimeframeSubscription from 'in-services/subscription/eventsInTimeframe';
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
      .flatMap(() => {
        return alwaysNull;
        // const timeOpened = this.props.form.get('timeOpened').value;
        // const eventTypes = this.props.form.get('eventTypes').value;
        // if (!`${query}`) {
        //   return search(timeOpened, eventTypes, '');
        // } else {
        //   return search(timeOpened, eventTypes, `${query}`);
        // }
      })
      .subscribe(events => {
        this.props.onChange('matchingEntities', events ? events.length : events);
      });
  }

  componentWillUpdate(nextProps) {
    this.debouncedQuery.emit(nextProps.form.get('query').value);
  }

  shouldComponentUpdate(nextProps) {
    const prevQuery = this.props.form.get('query').value;
    const nextQuery = nextProps.form.get('query').value;
    const prevEventTypes = this.props.form.get('eventTypes').value;
    const nextEventTypes = nextProps.form.get('eventTypes').value;
    if (prevQuery !== nextQuery || prevEventTypes !== nextEventTypes) {
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

// function search(timeOpened, eventTypes, query) {
//   return getEventsInTimeframeSubscription({
//     focusedMoment: timeOpened,
//     timeframe: {
//       to: timeOpened,
//       windowSize: 1000 * 60 * 60 * 24 * 7 // 1 week
//     },
//     query
//   });
// }
