/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import { create, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  undefinedMetricFormatter,
  createCustomMetricListItem,
  getCustomMetricsOptionsForPluginObservable,
  getPluginsWithCustomMetricsOptionsObservable,
  updateEntityTypesWithDeprecation
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customMetricUtils';
import {
  dataSourceCustom,
  dataSourceSystem,
  isCustomDataSourceSelected
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { getSelectedApplicationConfigsByName } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/components/Applications';
import { getEntityTypeOptionsOfBuiltInMetrics } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { EventDetailsSection } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/EventDetailsSection';
import { ConditionsSection } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ConditionsSection';
import ActionsSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ActionsSelection';
import ScopeSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ScopeSelection';
import { combinedValidationResults, valid } from 'in-settings/validation';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-settings/components/SectionHeading';
import { isBlank, isNotBlank } from 'in-services/util/string';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { containsMetricInList } from 'in-sdk/metrics';
import { validate } from 'in-api/search';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './CustomEventForm.mless';

const queryIsValid = just([true, true]);

// We use two observables to manage the various query validation aspects:
// 1. queryInput emits when the query is changed (the user is editing the query input field). When this happens we also
// start showing the progress indicator for the query validation and prohibit saving the form as long as the query
// validation is in progress.
const queryInput = create();

export default function EventForm({
  form,
  setForm,
  onChange,
  setSaveEnabled,
  hideLegacyAppDataEventDeprecationInfo,
  disabled,
  entity
}) {
  let queryValidationFinished = create();
  const entityType = form.get('entityType')?.value;

  const pluginsWithCustomMetrics = useObservable(() => {
    if (isCustomDataSourceSelected(form)) {
      return getPluginsWithCustomMetricsOptionsObservable();
    }
  }, [form]);

  const customMetricsForPlugin = useObservable(() => {
    if (entityType) {
      return getCustomMetricsOptionsForPluginObservable(entityType);
    }
  }, [entityType]);

  const queryValidationResult = useObservable(
    queryInput
      .distinct()
      .debounce(1000)
      .flatMap(query => {
        if (isNotBlank(query)) {
          return validate(query);
        } else {
          return queryIsValid;
        }
      })
      .tap(() => queryValidationFinished.emit(true)),
    []
  );
  const [queryValidationInProgress, setQueryValidationInProgress] = useState(false);
  queryValidationFinished = useObservable(
    queryValidationFinished.distinct().tap(finished => {
      if (finished) {
        setQueryValidationProgressState(false, setQueryValidationInProgress, setSaveEnabled);
      }
      queryValidationFinished.emit(false);
    }),
    [setQueryValidationInProgress, setSaveEnabled]
  );
  const selectedApplicationName = form.get('application') ? form.get('application').value : '';
  const existingApplication =
    selectedApplicationName === null || isBlank(selectedApplicationName)
      ? null
      : getSelectedApplicationConfigsByName(selectedApplicationName);
  useEffect(() => {
    if (isNotBlank(entity.query)) {
      queryInput.emit(entity.query);
    }
    // Deliberately executing Mixpanel tracking on these prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, queryInput]);

  addCurrentCustomMetricToListIfMissing(customMetricsForPlugin, form);

  applyQueryValidationResult(queryValidationResult, form, onChange);

  let pluginsWithMetricDefinitions;
  if (form.get('dataSource') && form.get('dataSource').value !== dataSourceSystem) {
    pluginsWithMetricDefinitions = getEntityTypeOptionsOfBuiltInMetrics(true);
    updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form);
  }

  let selectedApplicationIds = form.get('applicationIds') ? form.get('applicationIds').value : [];

  if (existingApplication) {
    existingApplication.forEach(app => {
      selectedApplicationIds.push(app.id);
    });
  }

  return (
    <fieldset>
      <SectionHeading>{t('in-settings:tabs.1EventDetails')}</SectionHeading>
      <EventDetailsSection disabled={disabled} form={form} onChange={onChange} />

      <SectionHeading>{t('in-settings:tabs.2Condition')}</SectionHeading>

      <ConditionsSection
        disabled={disabled}
        form={form}
        onChange={onChange}
        pluginsWithMetricDefinitions={pluginsWithMetricDefinitions}
        pluginsWithCustomMetrics={pluginsWithCustomMetrics}
        customMetricsForPlugin={customMetricsForPlugin}
        hideLegacyAppDataEventDeprecationInfo={hideLegacyAppDataEventDeprecationInfo}
      />

      <SectionHeading>{t('in-settings:tabs.3Scope')}</SectionHeading>
      <ScopeSelection
        form={form}
        selectedApplicationIds={selectedApplicationIds}
        disabled={disabled}
        setForm={setForm}
        onChange={onChange}
        setSaveEnabled={setSaveEnabled}
        queryValidationInProgress={queryValidationInProgress}
        setQueryValidationInProgress={setQueryValidationInProgress}
        startQueryValidation={startQueryValidation}
      />

      {role.canConfigureAutomationActions && actionAutomationEnabled && !form.get('triggering').value && (
        <>
          <div className={locals.titleWithBetatag}>
            <SectionHeading>{t('in-settings:tabs.4ActionAssociations')}</SectionHeading> <BetaBadge />
          </div>
          <ActionsSelection form={form} setForm={setForm} />
        </>
      )}
    </fieldset>
  );
}

function addCurrentCustomMetricToListIfMissing(customMetricsList, form) {
  if (!form || !customMetricsList) {
    return;
  }

  if (
    form.get('dataSource') &&
    form.get('dataSource').value === dataSourceCustom &&
    form.get('entityType') &&
    form.get('metricName')
  ) {
    const entityType = form.get('entityType').value;
    const metricName = form.get('metricName').value;

    if (entityType && metricName) {
      if (!containsMetricInList(customMetricsList, metricName)) {
        const metricItem = createCustomMetricListItem(metricName, undefinedMetricFormatter, metricName, entityType);
        customMetricsList.push(metricItem);
      }
    }
  }
}

function startQueryValidation(query, form, onChange, setQueryValidationInProgress, setSaveEnabled) {
  if (isBlank(query)) {
    onChange('validationResult', valid());
    setQueryValidationProgressState(false, setQueryValidationInProgress, setSaveEnabled);
    return form;
  }

  // The query has changed and it is not an empty string.

  // 1. First we hide any previous error message that might still be shown.
  let updatedForm = form.updateIn(['validationResult'], field =>
    field.setValue({ valid: true, error: null }).setTouched(false)
  );

  // 2. Next we show progress indicator and disable saving the form.
  // but do nothing if old and new query have the same value, this prevents us having an unlimited
  // loading spinner if same value got pasted again
  queryInput.once(previousQuery => {
    if (previousQuery !== query) {
      setQueryValidationProgressState(true, setQueryValidationInProgress, setSaveEnabled);
    }
  });

  // 3. Finally we start the actual query validation.
  queryInput.emit(query);

  return updatedForm;
}

function setQueryValidationProgressState(queryValidationInProgress, setQueryValidationInProgress, setSaveEnabled) {
  setQueryValidationInProgress(queryValidationInProgress);
  setSaveEnabled(!queryValidationInProgress);
}

function applyQueryValidationResult(queryValidationResult, form, onChange) {
  if (queryValidationResult && form.containsKey('validationResult')) {
    const combined = combinedValidationResults(queryValidationResult.body);
    if (!isEqual(combined, form.get('validationResult').value)) {
      // A little dirty trick to circumvents React's warning to not call setState during render. Sorry, not sorry.
      setTimeout(() => onChange('validationResult', combined), 0);
    }
  }
}
