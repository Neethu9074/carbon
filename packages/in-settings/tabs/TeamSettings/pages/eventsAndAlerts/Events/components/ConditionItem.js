/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  onBuiltInMetricChange,
  onCustomMetricChanged
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { DynamicBuiltInFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/DynamicBuiltInFormGroup';
import BuiltInMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/BuiltInMetricSelector';
import { ThresholdsFormGroup } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/ThresholdsFormGroup';
import CustomMetricSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/CustomMetricSelector';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export function ConditionItem({
  form,
  disabled,
  onChange,
  compactLayout,
  customMetricsForPlugin,
  entityType,
  builtInDataSourceSelected,
  customDataSourceSelected
}) {
  const metricNameField = form.get('metricName');
  const metricName = metricNameField?.value;

  return (
    <>
      {builtInDataSourceSelected && (
        <>
          <Row withoutTopMargin>
            <Col lg={12}>
              {entityType && (
                <FormGroup>
                  <Label htmlFor="event-metricName" hasError={!metricNameField.valid && metricNameField.touched}>
                    {t('in-settings:tabs.metric')}
                  </Label>
                  <BuiltInMetricSelector
                    disabled={disabled}
                    id="event-metricName"
                    plugin={entityType}
                    value={metricName}
                    isClearable={false}
                    onChange={onBuiltInMetricChange(metricName, onChange, entityType)}
                  />
                  <TouchedMessages field={metricNameField} />
                </FormGroup>
              )}
            </Col>
          </Row>

          <DynamicBuiltInFormGroup form={form} onChange={onChange} disabled={disabled} compactLayout={compactLayout} />

          {entityType && metricName && (
            <GroupContainer compactLayout={compactLayout}>
              <ThresholdsFormGroup disabled={disabled} form={form} onChange={onChange} />
            </GroupContainer>
          )}
        </>
      )}

      {customDataSourceSelected && (
        <>
          <Row withoutTopMargin>
            <Col lg={12}>
              {entityType && (
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
                    value={metricName}
                    metrics={customMetricsForPlugin}
                    onChange={onCustomMetricChanged(metricName, onChange, customMetricsForPlugin)}
                  />
                  <TouchedMessages field={metricNameField} />
                </FormGroup>
              )}
            </Col>
          </Row>

          {metricName && (
            <GroupContainer compactLayout={compactLayout}>
              <ThresholdsFormGroup disabled={disabled} form={form} onChange={onChange} />
            </GroupContainer>
          )}
        </>
      )}
    </>
  );
}

/* Layout depending on wrapper, FormGroup would add a bottom margin.
 * Replacing with simple a div in compact mode
 */
const GroupContainer = ({ compactLayout, children }) => {
  return compactLayout ? <div>{children}</div> : <FormGroup>{children}</FormGroup>;
};
