/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Spacer } from '@instana/components';

import {
  updateFormDefinitionForDataSource,
  systemRules,
  updateFormDefinitionForSystemRule,
  entityVerification,
  isSystemRuleDataSourceSelected,
  isCustomDataSourceSelected,
  isBuiltInDataSourceSelected,
  isHostAvailabilitySystemRule
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { ObserveHostHasMatchingEntitiesRunningFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/ObserveHostHasMatchingEntitiesRunningFormGroup';
import {
  getEntityTypeOptionsOfBuiltInMetrics,
  isAppDataEntityType
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import LegacyAppdataEventInfoMessage from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/LegacyAppdataEventInfoMessage';
import {
  dataSourceOptions,
  systemRuleOptions
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import HostAvailabilityFormGroup from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/HostAvailabilityFormGroup';
import { EntityTypeFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/EntityTypeFormGroup';
import { TimeWindowFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/ThresholdsFormGroup';
import { MultiConditions } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/MultiConditions';
import { hideAppDataLegacyEventsEnabled, deprecateAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import ComboBox from 'in-components/ComboBox';
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

  const systemRuleField = form.get('systemRule');

  const entityTypeField = form.get('entityType');
  const entityType = entityTypeField?.value;

  const rulesForm = form.get('rules');

  const builtInDataSourceSelected = isBuiltInDataSourceSelected(form);
  const customDataSourceSelected = isCustomDataSourceSelected(form);
  const appDataEntityType = isAppDataEntityType(entityType);

  return (
    <>
      {rulesForm?.hierarchyTouched && rulesForm?.valid === false && (
        <Row withoutTopMargin>
          <Col lg={12}>
            <TouchedMessages field={rulesForm} />
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={4}>
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
        <Col lg={4}>
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
          {builtInDataSourceSelected && (
            <EntityTypeFormGroup
              disabled={disabled}
              form={form}
              pluginsWithMetricDefinitions={pluginsWithMetricDefinitions}
              onChange={onChange}
            />
          )}
          {customDataSourceSelected && (
            <EntityTypeFormGroup
              disabled={disabled}
              form={form}
              pluginsWithMetricDefinitions={pluginsWithCustomMetrics}
              onChange={onChange}
            />
          )}
        </Col>
        {(builtInDataSourceSelected || customDataSourceSelected) && rulesForm?.size >= 1 && !appDataEntityType && (
          <TimeWindowFormGroup
            form={rulesForm.get(0)}
            onChange={getOnTimeWindowChangeUpdateAllRules(onChange)}
            disabled={disabled}
            columnsSize={4}
          />
        )}
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

      <MultiConditions
        builtInDataSourceSelected={builtInDataSourceSelected}
        customDataSourceSelected={customDataSourceSelected}
        entityType={entityType}
        rulesForm={rulesForm}
        onChange={onChange}
        disabled={disabled}
        customMetricsForPlugin={customMetricsForPlugin}
      />

      {!hideAppDataLegacyEventsEnabled &&
        deprecateAppDataLegacyEventsEnabled &&
        !hideLegacyAppDataEventDeprecationInfo &&
        !disabled &&
        appDataEntityType && <LegacyAppdataEventInfoMessage />}

      <Spacer vertical="normal" />
    </>
  );
}

function getOnTimeWindowChangeUpdateAllRules(onChangeRoot) {
  return (ruleFieldName, value) => {
    onChangeRoot(form => {
      let rulesForm = form.get('rules');
      for (let i = 0; i < rulesForm.size; i++) {
        rulesForm = rulesForm.updateIn([i, ruleFieldName], f => f.setValue(value).setTouched(true));
      }
      return form.put('rules', rulesForm);
    });
  };
}
