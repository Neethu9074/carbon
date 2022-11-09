/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  updateFormDefinitionForDataSource,
  systemRules,
  updateFormDefinitionForSystemRule,
  entityVerification,
  putRollupField,
  putWindowField,
  putAggregationField,
  putMetricPatternOperator,
  putMetricPatternPlaceholder,
  isSystemRuleDataSourceSelected,
  isCustomDataSourceSelected,
  isBuiltInDataSourceSelected,
  isPercentile,
  isHostAvailabilitySystemRule
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { ObserveHostHasMatchingEntitiesRunningFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ObserveHostHasMatchingEntitiesRunningFormGroup';
import {
  getEntityTypeOptionsOfBuiltInMetrics,
  isAppDataEntityType
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import LegacyAppdataEventInfoMessage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import {
  getBuiltInMetricInfo,
  getCustomMetricInfo
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customMetricUtils';
import {
  dataSourceOptions,
  systemRuleOptions
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import HostAvailabilityFormGroup from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/HostAvailabilityFormGroup';
import { DynamicBuiltInFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/DynamicBuiltInFormGroup';
import { EntityTypeFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/EntityTypeFormGroup';
import BuiltInMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/BuiltInMetricSelector';
import { ThresholdsFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/ThresholdsFormGroup';
import CustomMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/CustomMetricSelector';
import { hideAppDataLegacyEventsEnabled, deprecateAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import { getAllBuiltInMetrics, isBuiltInPlainMetric } from 'in-sdk/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import ComboBox from 'in-components/ComboBox';
import { find } from 'in-services/arrayUtils';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export function ConditionsSection({
  form,
  disabled,
  onChange,
  pluginsWithMetricDefinitions,
  pluginsWithCustomMetrics,
  customMetricsForPlugin,
  hideLegacyAppDataEventDeprecationInfo
}) {
  const dataSourceField = form.get('dataSource');

  if (!dataSourceField) {
    return null;
  }

  const entityTypeField = form.get('entityType');
  const metricNameField = form.get('metricName');
  const systemRuleField = form.get('systemRule');

  return (
    <>
      <Row>
        <Col lg={6}>
          <FormGroup>
            <Label htmlFor="event-data-source" hasError={!dataSourceField.valid && dataSourceField.touched}>
              {t('in-settings:tabs.source')}
            </Label>
            <ComboBox
              isDisabled={disabled}
              name="event-data-source"
              value={dataSourceField.value}
              options={dataSourceOptions}
              onChange={e => {
                onChange('dataSource', e ? e.value : null, (updatedForm, eventSpec) => {
                  return updateFormDefinitionForDataSource(updatedForm, dataSourceField.value, eventSpec, systemRules);
                });
              }}
              isClearable={false}
            />
            <TouchedMessages field={dataSourceField} />
          </FormGroup>
        </Col>
        <Col lg={6}>
          {isSystemRuleDataSourceSelected(form) && (
            <FormGroup>
              <Label htmlFor="event-system-rule" hasError={!systemRuleField.valid && systemRuleField.touched}>
                {t('in-settings:tabs.systemRule')}
              </Label>
              <ComboBox
                isDisabled={disabled}
                name="event-system-rule"
                value={systemRuleField.value}
                options={systemRuleOptions(systemRules)}
                onChange={e => {
                  onChange('systemRule', e ? e.value : null, (updatedForm, eventSpec) => {
                    return updateFormDefinitionForSystemRule(
                      updatedForm,
                      systemRuleField.value,
                      eventSpec,
                      systemRules
                    );
                  });
                }}
                isClearable={false}
              />
              <TouchedMessages field={systemRuleField} />
            </FormGroup>
          )}
          {isBuiltInDataSourceSelected(form) && (
            <EntityTypeFormGroup
              disabled={disabled}
              form={form}
              pluginsWithMetricDefinitions={pluginsWithMetricDefinitions}
              onChange={onChange}
            />
          )}
          {isCustomDataSourceSelected(form) && (
            <EntityTypeFormGroup
              disabled={disabled}
              form={form}
              pluginsWithMetricDefinitions={pluginsWithCustomMetrics}
              onChange={onChange}
            />
          )}
        </Col>
      </Row>
      {isSystemRuleDataSourceSelected(form) && (
        <>
          {systemRuleField?.value === entityVerification.id && (
            <ObserveHostHasMatchingEntitiesRunningFormGroup
              disabled={disabled}
              form={form}
              entityTypes={getEntityTypeOptionsOfBuiltInMetrics(true)}
              onChange={onChange}
            />
          )}

          {isHostAvailabilitySystemRule(form) && (
            <HostAvailabilityFormGroup form={form} onChange={onChange} disabled={disabled} />
          )}
        </>
      )}

      {isBuiltInDataSourceSelected(form) && (
        <>
          <Row withoutTopMargin>
            <Col lg={12}>
              {entityTypeField.value && (
                <FormGroup>
                  <Label htmlFor="event-metricName" hasError={!metricNameField.valid && metricNameField.touched}>
                    {t('in-settings:tabs.metric')}
                  </Label>
                  <BuiltInMetricSelector
                    disabled={disabled}
                    id="event-metricName"
                    plugin={entityTypeField.value}
                    value={metricNameField.value}
                    isClearable={false}
                    onChange={e => {
                      if ((metricNameField.value && !e) || (e && e.value !== metricNameField.value)) {
                        let selectedMetric = e ? e.value : '';
                        onChange('metricName', selectedMetric, updatedForm => {
                          if (isPercentile(updatedForm)) {
                            updatedForm = updatedForm.remove('window').remove('aggregation');
                            updatedForm = putRollupField(updatedForm);
                          } else {
                            updatedForm = updatedForm.remove('rollup');
                            updatedForm = putWindowField(updatedForm);
                            updatedForm = putAggregationField(updatedForm);
                          }

                          const entityType = entityTypeField.value;
                          const buildInMetricsList = getAllBuiltInMetrics(entityType);
                          const metricItem = find(buildInMetricsList, _metric => _metric.value === selectedMetric);

                          if (metricItem) {
                            if (isBuiltInPlainMetric(entityType, metricItem.value)) {
                              updatedForm = updatedForm
                                .remove('metricPatternOperator')
                                .remove('metricPatternPlaceholder');
                            } else {
                              updatedForm = putMetricPatternOperator(updatedForm);
                              updatedForm = putMetricPatternPlaceholder(updatedForm);
                            }

                            const metricInfo = getBuiltInMetricInfo(metricItem);
                            updatedForm = updatedForm
                              .updateIn(['formatter'], f => f.setValue(metricInfo.formatter))
                              .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
                              .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));
                          }

                          return updatedForm;
                        });
                      }
                    }}
                  />
                  <TouchedMessages field={metricNameField} />
                </FormGroup>
              )}
            </Col>
          </Row>

          <DynamicBuiltInFormGroup form={form} onChange={onChange} disabled={disabled} />

          {entityTypeField.value && metricNameField.value && (
            <ThresholdsFormGroup disabled={disabled} form={form} onChange={onChange} />
          )}
        </>
      )}

      {isCustomDataSourceSelected(form) && (
        <>
          <Row withoutTopMargin>
            <Col lg={12}>
              <FormGroup>
                <Label htmlFor="event-metricName" hasError={!metricNameField.valid && metricNameField.touched}>
                  {t('in-settings:tabs.metric')}
                </Label>
                <CustomMetricSelector
                  disabled={disabled || !customMetricsForPlugin}
                  // Workaround to clear the selection when the entity-type change.
                  // It is not that expensive, because it is a small component.
                  // It is a workaround for the underlying AutoComplete based on Downshift library,
                  // because it was not re-rendering when the options have actually changed!
                  key={Math.random()}
                  id="event-metricName"
                  value={metricNameField.value}
                  metrics={customMetricsForPlugin}
                  onChange={e => {
                    if ((metricNameField.value && !e) || (e && e.value !== metricNameField.value)) {
                      let selectedMetric = e ? e.value : '';
                      onChange('metricName', selectedMetric, (updatedForm, eventSpec) => {
                        updatedForm = updatedForm.remove('rollup');
                        updatedForm = putWindowField(updatedForm, eventSpec);
                        updatedForm = putAggregationField(updatedForm, eventSpec);

                        const metricInfo = getCustomMetricInfo(customMetricsForPlugin, selectedMetric);

                        updatedForm = updatedForm
                          .updateIn(['formatter'], f => f.setValue(metricInfo.formatter))
                          .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
                          .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));

                        return updatedForm;
                      });
                    }
                  }}
                />
                <TouchedMessages field={metricNameField} />
              </FormGroup>
            </Col>
          </Row>

          {metricNameField.value && <ThresholdsFormGroup disabled={disabled} form={form} onChange={onChange} />}
        </>
      )}

      {!hideAppDataLegacyEventsEnabled &&
        deprecateAppDataLegacyEventsEnabled &&
        !hideLegacyAppDataEventDeprecationInfo &&
        !disabled &&
        isAppDataEntityType(form.get('entityType')?.value ?? '') && <LegacyAppdataEventInfoMessage />}
    </>
  );
}
