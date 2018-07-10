import { create, combineLatest } from 'reactive-observables';
import React from 'react';

import getEventsInTimeframeSubscription from 'in-subscription/getEventsInTimeframeBothModes';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { validate } from 'in-api/search';

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
        const timeOpened = this.props.form.get('timeOpened').value;
        const eventTypes = this.props.form.get('eventTypes').value;
        if (!query) {
          return search(timeOpened, eventTypes, '');
        } else {
          return search(timeOpened, eventTypes, query);
        }
      })
      .subscribe(events => {
        this.props.onChange('matchingEntities', events ? events.length : events);
      });
    this.subscription = this.debouncedQuery
      .debounce(1000)
      .flatMap(query => {
        return combineLatest([validate(query, false), validate(query, true)]);
      })
      .subscribe(([validationResponse10, validationResponse20]) => {
        this.props.onChange(
          'validationResult',
          combinedValidationResults(validationResponse10.body, validationResponse20.body)
        );
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

function combinedValidationResults(validationResult10, validationResult20) {
  if (twoZeroModeEnabled) {
    return validationResult20;
  } else {
    if (validationResult20.valid) {
      return validationResult20;
    } else {
      return validationResult10;
    }
  }
}

function search(timeOpened, eventTypes, query) {
  if (eventTypes && eventTypes.size > 0) {
    const eventTypesQueryPart = eventTypes
      .toArray()
      .map(type => `event.type:${type}`)
      .join(' OR ');
    if (query) {
      query = `(${query}) AND (${eventTypesQueryPart})`;
    } else {
      query = eventTypesQueryPart;
    }
  }

  return getEventsInTimeframeSubscription({
    timeConfig: {
      focusedMoment: timeOpened,
      to: timeOpened,
      windowSize: 1000 * 60 * 60 * 24 * 7 * 2 // 2 weeks
    },
    query
  });
}
