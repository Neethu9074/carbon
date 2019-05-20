import { create } from 'reactive-observables';
import React from 'react';

import getEventsInTimeframeSubscription from 'in-subscription/getEventsInTimeframeBothModes';
import { combinedValidationResults, valid } from 'in-settings/validation';
import { isBlank } from 'in-services/util/string';
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
    this.queryInput.emit(getValueOrDefault(this.props.form, 'query', ''));
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
    this.validationResultSubscription = debouncedQuery.flatMap(validate).subscribe(validationResponse20 => {
      // we need to ensure here whether the field are available before we update,
      // because in call Apply on 'all' is selected, we still query to get the
      // number of matching entities, but e.g. the validation result field is only
      // available when Apply on 'dfq'.
      this.tryOnChange('validationResult', combinedValidationResults(validationResponse20.body));
      this.tryOnChange('queryValidationInProgress', false);
    });
  }

  tryOnChange = (field, value) => {
    if (this.props.form.containsKey(field)) {
      this.props.onChange(field, value);
    }
  };

  componentWillUpdate(nextProps) {
    startValidationInProgress(nextProps.setForm, nextProps.form);
    this.queryInput.emit(getValueOrDefault(nextProps.form, 'query', ''));
  }

  shouldComponentUpdate(nextProps) {
    const prevQuery = getValueOrDefault(this.props.form, 'query', '');
    const nextQuery = getValueOrDefault(nextProps.form, 'query', '');
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

function getValueOrDefault(form, key, fallback) {
  return form.containsKey(key) ? form.get(key).value : fallback;
}

function startValidationInProgress(setForm, form) {
  const query = getValueOrDefault(form, 'query', '');
  if (isBlank(query)) {
    return;
  }
  // hide previous error message
  let updatedForm = form.updateIn(['validationResult'], field => field.setValue(valid()).setTouched(false));
  // show progress indicator
  updatedForm = updatedForm.updateIn(['queryValidationInProgress'], field => field.setValue(true).setTouched(false));
  setForm(updatedForm);
}
