/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  undefinedMetricFormatter,
  createCustomMetricListItem,
  getCustomMetricsOptionsForPluginObservable,
  getPluginsWithCustomMetricsOptionsObservable,
  updateEntityTypesWithDeprecation
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customMetricUtils';
import {
  dataSourceCustom,
  dataSourceSystem,
  isCustomDataSourceSelected
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { getSelectedApplicationConfigsByName } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/components/Applications';
import { isEntityCountSystemRule } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import TransientEventsSection from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/TransientEventsSection';
import { getEntityTypeOptionsOfBuiltInMetrics } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import { EventDetailsSection } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/EventDetailsSection';
import { ConditionsSection } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/ConditionsSection';
import ScopeSelection from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/ScopeSelection';
import { eventsTransientEventEnabled } from 'in-services/featureFlags';
import SectionHeading from 'in-settings/components/SectionHeading';
import { containsMetricInList } from 'in-sdk/metrics';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function CustomEventForm({ form, setForm, onChange, hideLegacyAppDataEventDeprecationInfo, disabled }) {
  const entityType = form.get('entityType')?.value;
  const pluginsWithCustomMetrics = useObservable(() => {
    if (isCustomDataSourceSelected(form)) {
      return getPluginsWithCustomMetricsOptionsObservable();
    }
  }, [form.get('dataSource').value]);

  const customMetricsForPlugin = useObservable(() => {
    return getCustomMetricOptions(form, entityType);
  }, [entityType]);

  const selectedApplicationName = form.get('application') ? form.get('application').value : '';

  const existingApplication = useObservable(() => {
    if (selectedApplicationName === null || isBlank(selectedApplicationName)) {
      return null;
    } else {
      return getSelectedApplicationConfigsByName(selectedApplicationName);
    }
  }, [selectedApplicationName]);
  // extend custom-metrics list with current selected custom-metric,
  // in case it is not contained in the list. This might happen due to
  // deprecation or there is no such metric anymore
  addCurrentCustomMetricToListIfMissing(customMetricsForPlugin, form);

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

  const showScopingSection = !isEntityCountSystemRule(form);
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

      {showScopingSection && (
        <>
          <SectionHeading>{t('in-settings:tabs.3Scope')}</SectionHeading>
          <ScopeSelection
            key={`${form.get('dataSource')?.value}_${form.get('systemRule')?.value}`}
            form={form}
            selectedApplicationIds={selectedApplicationIds}
            disabled={disabled}
            setForm={setForm}
            onChange={onChange}
          />
        </>
      )}
      {eventsTransientEventEnabled && (
        <>
          <SectionHeading>{t('in-settings:tabs.4TransientEvents')}</SectionHeading>
          <TransientEventsSection disabled={disabled} form={form} onChange={onChange} />
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

export function getCustomMetricOptions(form, entityType, searchKey = undefined) {
  if (isCustomDataSourceSelected(form) && entityType) {
    return getCustomMetricsOptionsForPluginObservable(entityType, searchKey);
  }
}
