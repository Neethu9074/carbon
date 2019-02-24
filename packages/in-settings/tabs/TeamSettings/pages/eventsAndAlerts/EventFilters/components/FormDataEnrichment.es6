import React from 'react';

import {
  applicationNameToDfq,
  scopeApplication,
  scopeEverything,
  scopeDfq
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import getEventsInTimeframeSubscription from 'in-subscription/getEventsInTimeframeBothModes';
import { combinedValidationResults, valid } from 'in-settings/validation';
import { create, combineLatest } from 'reactive-observables';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { isBlank } from 'in-services/util/string';
import { validate } from 'in-api/search';

export default class FormDataEnrichment extends React.Component {
  static displayName = 'FormDataEnrichment';

  state = {
    matchingEntities: null
  };

  applyOnInput = create();
  queryInput = create();
  applicationInput = create();

  matchingEntitesSubscription = null;
  validationResultSubscription = null;

  componentWillMount() {
    const debouncedQuery = this.queryInput.debounce(1000);
    this.applyOnInput.emit(getValueOrDefault(this.props.form, 'applyOn', ''));
    this.queryInput.emit(getValueOrDefault(this.props.form, 'query', ''));
    this.applicationInput.emit(getValueOrDefault(this.props.form, 'application', ''));
    this.matchingEntitesSubscription = combineLatest([debouncedQuery, this.applyOnInput, this.applicationInput])
      .flatMap(([query, applyOn, application]) => {
        const timeOpened = this.props.form.get('timeOpened').value;
        const eventTypes = this.props.form.get('eventTypes').value;
        if (applyOn === scopeApplication && application) {
          return search(timeOpened, eventTypes, applicationNameToDfq(application));
        } else if (applyOn === scopeDfq) {
          return search(timeOpened, eventTypes, query ? query : '');
        } else if (applyOn === scopeEverything) {
          return search(timeOpened, eventTypes, '');
        } else {
          return alwaysEmptyArray;
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
        // we need to ensure here whether the field are available before we update,
        // because in call Apply on 'all' is selected, we still query to get the
        // number of matching entities, but e.g. the validation result field is only
        // available when Apply on 'dfq'.
        this.tryOnChange(
          'validationResult',
          combinedValidationResults(validationResponse10.body, validationResponse20.body)
        );
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
    this.applyOnInput.emit(getValueOrDefault(nextProps.form, 'applyOn', ''));
    this.queryInput.emit(getValueOrDefault(nextProps.form, 'query', ''));
    this.applicationInput.emit(getValueOrDefault(nextProps.form, 'application', ''));
  }

  shouldComponentUpdate(nextProps) {
    const prevApplyOn = getValueOrDefault(this.props.form, 'applyOn', '');
    const nextApplyOn = getValueOrDefault(nextProps.form, 'applyOn', '');
    const prevQuery = getValueOrDefault(this.props.form, 'query', '');
    const nextQuery = getValueOrDefault(nextProps.form, 'query', '');
    const prevApplication = getValueOrDefault(this.props.form, 'application', '');
    const nextApplication = getValueOrDefault(nextProps.form, 'application', '');
    const prevEventTypes = this.props.form.get('eventTypes').value;
    const nextEventTypes = nextProps.form.get('eventTypes').value;
    return (
      prevApplyOn !== nextApplyOn ||
      prevQuery !== nextQuery ||
      prevApplication !== nextApplication ||
      prevEventTypes !== nextEventTypes
    );
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
