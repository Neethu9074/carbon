/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import {
  aggregationOptions,
  conditionOperatorOptions,
  getOptionsWithAdditionalValueIfMissing,
  rollupOptions,
  windowOptions
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { isPercentile } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { formatterTypeToDefinition } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { CustomEventSpecificationWithMetadata, Nullish } from 'in-types';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { FormatterType } from 'in-services/formatters/number';
import ComboBox, { Option } from 'in-components/ComboBox';
import FormGroup from 'in-settings/components/FormGroup';
import { Col, Row } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

interface ThresholdsFormGroupProps {
  form: MapForm;
  onChange: (
    fieldName: string,
    value: string | Nullish,
    updateFormDefinition?: (mapForm: MapForm, entity: CustomEventSpecificationWithMetadata) => MapForm
  ) => MapForm;
  compactLayout?: boolean;
  disabled: boolean;
}

export function ThresholdsFormGroup({ form, onChange, disabled, compactLayout }: ThresholdsFormGroupProps) {
  const isPercentileMetric = isPercentile(form);
  return (
    <Row withoutTopMargin={compactLayout}>
      {!isPercentileMetric && (
        <Col lg={3}>
          {(form.get('window') as Field<string>).map(field => (
            <FormGroup>
              <Label htmlFor="event-window" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.timeWindow')}
              </Label>
              <ComboBox
                isDisabled={disabled}
                name="event-window"
                value={field.value}
                options={getOptionsWithAdditionalValueIfMissing(windowOptions, field.value)}
                onChange={e => onChange('window', e ? (e as Option).value : '')}
                isClearable={false}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      )}
      {isPercentileMetric && (
        <Col lg={3}>
          {(form.get('rollup') as Field<string>).map(field => (
            <FormGroup>
              <Label htmlFor="event-rollup" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.windowSize')}
              </Label>
              <ComboBox
                isDisabled={disabled}
                name="event-rollup"
                value={field.value}
                options={rollupOptions}
                onChange={e => onChange('rollup', e ? (e as Option).value : '')}
                isClearable={false}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      )}
      {!isPercentileMetric && (
        <Col lg={3}>
          {(form.get('aggregation') as Field<string>).map(field => (
            <FormGroup>
              <Label htmlFor="event-aggregation" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.aggregation')}
              </Label>
              <ComboBox
                isDisabled={disabled}
                name="event-aggregation"
                value={field.value}
                options={aggregationOptions}
                onChange={e => onChange('aggregation', e ? (e as Option).value : null)}
                isClearable={false}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      )}
      <Col lg={3}>
        {(form.get('conditionOperator') as Field<string>).map(field => (
          <FormGroup>
            <Label htmlFor="event-conditionOperator" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.operator')}
            </Label>
            <ComboBox
              isDisabled={disabled}
              name="event-conditionOperator"
              value={field.value}
              options={conditionOperatorOptions}
              onChange={e => onChange('conditionOperator', e ? (e as Option).value : null)}
              isClearable={false}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Col>
      <Col lg={3}>
        {(form.get('conditionValue') as Field<string>).map(field => (
          <FormGroup>
            <Label htmlFor="event-conditionValue" hasError={!field.valid && field.touched}>
              {formatterTypeToDefinition((form.get('formatter') as Field<FormatterType>).value)}
            </Label>
            <Input
              disabled={disabled}
              id="event-conditionValue"
              type="text"
              value={field.value}
              onChange={e => onChange('conditionValue', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
}
