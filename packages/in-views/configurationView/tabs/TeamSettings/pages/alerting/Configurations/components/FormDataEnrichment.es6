import React from 'react';

import getEventsInTimeframeSubscription from 'in-subscription/getEventsInTimeframeBothModes';
import { combinedValidationResults } from 'in-views/configurationView/validation';
import { create, combineLatest } from 'reactive-observables';
import { validate } from 'in-api/search';

export default class FormDataEnrichment extends React.Component {
  static displayName = 'FormDataEnrichment';

  state = {
    matchingEntities: null
  };

  queryInput = create();
  matchingEntitesSubscription = null;
  validationResultSubscription = null;

  componentWillMount() {
    const debouncedQuery = this.queryInput.debounce(1000);
    this.queryInput.emit(this.props.form.get('query').value);
    this.matchingEntitesSubscription = debouncedQuery
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
    this.validationResultSubscription = debouncedQuery
      .flatMap(query => {
        return combineLatest([
          validate({ query, newApplicationModelEnabled: false }),
          validate({ query, newApplicationModelEnabled: true })
        ]);
      })
      .subscribe(([validationResponse10, validationResponse20]) => {
        this.props.onChange(
          'validationResult',
          combinedValidationResults(validationResponse10.body, validationResponse20.body)
        );
        this.props.onChange('queryValidationInProgress', false);
      });
  }

  componentWillUpdate(nextProps) {
    startValidationInProgress(nextProps.setForm, nextProps.form);
    this.queryInput.emit(nextProps.form.get('query').value);
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
    if (this.matchingEntitesSubscription) {
      this.matchingEntitesSubscription.dispose();
      this.matchingEntitesSubscription = null;
    }
    if (this.validationResultSubscription) {
      this.validationResultSubscription.dispose();
      this.validationResultSubscription = null;
    }
  }

  render() {
    return null;
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

function startValidationInProgress(setForm, form) {
  // hide previous error message
  let updatedForm = form.updateIn(['validationResult'], field =>
    field.setValue({ valid: true, error: null }).setTouched(false)
  );
  // show progress indicator
  updatedForm = updatedForm.updateIn(['queryValidationInProgress'], field => field.setValue(true).setTouched(false));
  setForm(updatedForm);
}
