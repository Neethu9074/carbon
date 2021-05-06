/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest, create } from '@instana/observables';

import {
  applicationIdsToDfq,
  scopeApplication,
  scopeDfq,
  scopeEverything
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import {
  modeEventTypes,
  modeSelectedEvents
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/Step2';
import { combinedValidationResults, valid } from 'in-settings/validation';
import getRawEvents from 'in-subscription/getRawEvents';
import { alwaysNull } from 'in-services/fixedStreams';
import { isBlank } from 'in-services/util/string';
import { validate } from 'in-api/search';
import { days } from 'in-services/time';

export default class FormDataEnrichment extends React.Component {
  static displayName = 'FormDataEnrichment';

  state = {
    matchingEntities: null
  };

  eventSelectionModeInput = create();
  eventTypesInput = create();
  selectedEventsInput = create();
  applyOnInput = create();
  queryInput = create();
  applicationIdsInput = create();

  matchingEntitesSubscription = null;
  validationResultSubscription = null;

  componentDidMount() {
    const debouncedQuery = this.queryInput.debounce(1000);
    this.emitAllInputs(this.props.form);
    this.setUpMatchingEntitesSubscription(debouncedQuery);
    this.setUpQueryValidationSubscription(debouncedQuery);
  }

  emitAllInputs(form) {
    this.eventSelectionModeInput.emit(getValueOrDefault(form, 'eventSelectionMode', ''));
    this.eventTypesInput.emit(getValueOrDefault(form, 'eventTypes', ''));
    this.selectedEventsInput.emit(getValueOrDefault(form, 'selectedEvents', ''));
    this.applyOnInput.emit(getValueOrDefault(form, 'applyOn', ''));
    this.queryInput.emit(getValueOrDefault(form, 'query', ''));
    this.applicationIdsInput.emit(getValueOrDefault(form, 'applicationIds', ''));
  }

  setUpMatchingEntitesSubscription(debouncedQuery) {
    const debouncedEventTypes = this.eventTypesInput.debounce(1000);
    const debouncedSelectedEvents = this.selectedEventsInput.debounce(1000);

    this.matchingEntitesSubscription = combineLatest([
      this.eventSelectionModeInput,
      debouncedEventTypes,
      debouncedSelectedEvents,
      this.applyOnInput,
      debouncedQuery,
      this.applicationIdsInput
    ])
      .flatMap(([eventSelectionMode, eventTypes, selectedEvents, applyOn, query, applicationIds]) => {
        const timeOpened = this.props.form.get('timeOpened').value;
        this.props.onChange('matchingEntitiesQueryInProgress', true);
        let searchFn;
        let eventParam;
        if (eventSelectionMode === modeEventTypes) {
          searchFn = searchWithEventTypes;
          eventParam = eventTypes;
        } else if (eventSelectionMode === modeSelectedEvents) {
          searchFn = searchWithSelectedEvents;
          eventParam = selectedEvents;
        } else {
          return alwaysNull;
        }

        let queryForSearch;
        if (applyOn === scopeApplication && applicationIds) {
          queryForSearch = applicationIdsToDfq(applicationIds);
        } else if (applyOn === scopeDfq) {
          queryForSearch = query ? query : '';
        } else if (applyOn === scopeEverything) {
          queryForSearch = '';
        } else {
          return alwaysNull;
        }

        return searchFn(timeOpened, eventParam, queryForSearch);
      })
      .subscribe(result => {
        this.props.onChange('matchingEntities', result && result.data ? result.data.totalHits : result);
        this.props.onChange('matchingEntitiesQueryInProgress', false);
      });
  }

  setUpQueryValidationSubscription(debouncedQuery) {
    this.validationResultSubscription = debouncedQuery.flatMap(validate).subscribe(validationResponse20 => {
      // We need to ensure whether the field is available before we update. If the current selected scope is not
      // 'dfq', the validation result field is not available.
      this.tryOnChange('validationResult', combinedValidationResults(validationResponse20.body));
      this.tryOnChange('queryValidationInProgress', false);
    });
  }

  tryOnChange = (field, value) => {
    if (this.props.form.containsKey(field)) {
      this.props.onChange(field, value);
    }
  };

  shouldComponentUpdate(nextProps) {
    const prevEventSelectionMode = getValueOrDefault(this.props.form, 'eventSelectionMode', '');
    const nextEventSelectionMode = getValueOrDefault(nextProps.form, 'eventSelectionMode', '');
    const prevEventTypes = getValueOrDefault(this.props.form, 'eventTypes', '');
    const nextEventTypes = getValueOrDefault(nextProps.form, 'eventTypes', '');
    const prevSelectedEvents = getValueOrDefault(this.props.form, 'selectedEvents', '');
    const nextSelectedEvents = getValueOrDefault(nextProps.form, 'selectedEvents', '');
    const prevApplyOn = getValueOrDefault(this.props.form, 'applyOn', '');
    const nextApplyOn = getValueOrDefault(nextProps.form, 'applyOn', '');
    const prevQuery = getValueOrDefault(this.props.form, 'query', '');
    const nextQuery = getValueOrDefault(nextProps.form, 'query', '');
    const prevApplicationIds = getValueOrDefault(this.props.form, 'applicationIds', '');
    const nextApplicationIds = getValueOrDefault(nextProps.form, 'applicationIds', '');

    return (
      prevEventSelectionMode !== nextEventSelectionMode ||
      prevEventTypes !== nextEventTypes ||
      prevSelectedEvents !== nextSelectedEvents ||
      prevApplyOn !== nextApplyOn ||
      prevQuery !== nextQuery ||
      prevApplicationIds !== nextApplicationIds
    );
  }

  componentDidUpdate() {
    startValidationInProgress(this.props.setForm, this.props.form);
    this.emitAllInputs(this.props.form);
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

function searchWithEventTypes(timeOpened, eventTypes, query) {
  let eventTypesQueryPart = null;
  if (eventTypes && eventTypes.size > 0) {
    eventTypesQueryPart = eventTypes
      .toArray()
      .map(type => `event.type:${type}`)
      .join(' OR ');
  }
  return search(timeOpened, query, eventTypesQueryPart);
}

function searchWithSelectedEvents(timeOpened, selectedEvents, query) {
  let selectedEventsQueryPart = null;
  if (selectedEvents && selectedEvents.size > 0) {
    selectedEventsQueryPart = selectedEvents
      .toArray()
      .map(eventSpecificationId => `event.specification.id:"${eventSpecificationId}"`)
      .join(' OR ');
  }
  return search(timeOpened, query, selectedEventsQueryPart);
}

function search(timeOpened, query, additionalQueryPart) {
  if (query) {
    query = `(${query}) AND (${additionalQueryPart})`;
  } else {
    query = additionalQueryPart;
  }
  return getRawEvents({
    timeConfig: {
      focusedMoment: timeOpened,
      to: timeOpened,
      windowSize: days.toMillis(14)
    },
    query,
    pagination: {
      //we are only interested in the total count, so a page size of 1 is enough
      retrievalSize: 1
    },
    // order doesn't matter, but we must define it to avoid NPEs
    order: {
      by: 'start',
      direction: 'DESC'
    }
  });
}

function getValueOrDefault(form, key, fallback) {
  return form.containsKey(key) ? form.get(key).value : fallback;
}

function startValidationInProgress(setForm, form) {
  const applyOn = getValueOrDefault(form, 'applyOn', null);
  const query = getValueOrDefault(form, 'query', '');
  if (applyOn !== scopeDfq && isBlank(query)) {
    return;
  }
  // hide previous error message
  let updatedForm = form.updateIn(['validationResult'], field => field.setValue(valid()).setTouched(false));
  // show progress indicator
  updatedForm = updatedForm.updateIn(['queryValidationInProgress'], field => field.setValue(true).setTouched(false));
  setForm(updatedForm);
}
