/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { putMetricPatternPlaceholder } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { metricPatternMatchingOptions } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { DynamicMetricPattern, getMetricDefinition, isBuiltInDynamicMetric } from 'in-sdk/metrics';
import { CustomEventSpecificationWithMetadata, Nullish } from 'in-types';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ComboBox, { Option } from 'in-components/ComboBox';
import FormGroup from 'in-settings/components/FormGroup';
import { Col } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

const placeholderLabel = t('in-settings:tabs.team.events.placeholder');

interface DynamicBuiltInFormGroupProps {
  form: MapForm;
  onChange: (
    fieldName: string,
    value: string | Nullish,
    updateFormDefinition?: (mapForm: MapForm, entity: CustomEventSpecificationWithMetadata) => MapForm
  ) => MapForm;

  disabled: boolean;
}

export function DynamicBuiltInFormGroup({ form, onChange, disabled }: DynamicBuiltInFormGroupProps) {
  const entityType = (form.get('entityType') as Field<string>)?.value;
  const metricName = (form.get('metricName') as Field<string>)?.value;

  if (!entityType || !metricName || !isBuiltInDynamicMetric(entityType, metricName)) {
    return null;
  }

  const metricPatternPlaceholder = form.get('metricPatternPlaceholder') as Field<string>;
  const metricPatternOperator = form.get('metricPatternOperator') as Field<string>;

  return (
    <>
      <Col lg={2}>
        <FormGroup>
          <Label
            htmlFor="event-metricPatternOperator"
            hasError={!metricPatternOperator.valid && metricPatternOperator.touched}
          >
            {t('in-settings:tabs.matchingOperator')}
          </Label>
          <ComboBox
            isDisabled={disabled}
            name="event-metricPatternOperator"
            value={metricPatternOperator.value}
            options={metricPatternMatchingOptions}
            onChange={e => {
              const prevOperator = metricPatternOperator.value;
              const newOperator = e ? (e as Option).value : '';
              onChange('metricPatternOperator', newOperator, updatedForm => {
                if (newOperator === 'any') {
                  updatedForm = updatedForm.remove('metricPatternPlaceholder');
                } else if (prevOperator === 'any') {
                  updatedForm = putMetricPatternPlaceholder(updatedForm);
                }
                return updatedForm;
              });
            }}
            isClearable={false}
          />
          <TouchedMessages field={metricPatternOperator} />
        </FormGroup>
      </Col>
      <Col lg={2}>
        {metricPatternPlaceholder && (
          <FormGroup>
            <Label
              htmlFor="event-metricPatternPlaceholder"
              hasError={!metricPatternPlaceholder.valid && metricPatternPlaceholder.touched}
            >
              {getPlaceholderLabel(entityType, metricName)}
            </Label>
            <Input
              disabled={disabled}
              id="event-metricPatternPlaceholder"
              type="text"
              value={metricPatternPlaceholder.value}
              onChange={e => onChange('metricPatternPlaceholder', e.target.value)}
              hasError={!metricPatternPlaceholder.valid && metricPatternPlaceholder.touched}
            />
            <TouchedMessages field={metricPatternPlaceholder} />
          </FormGroup>
        )}
      </Col>
    </>
  );
}

function getPlaceholderLabel(entityType: string, metricName: string) {
  const metricPattern = getMetricDefinition(entityType, metricName)?.metricPattern;

  if (metricPattern) {
    const { placeholderLabel } = metricPattern as DynamicMetricPattern;
    if (placeholderLabel) {
      return placeholderLabel;
    }
  }
  return placeholderLabel;
}
