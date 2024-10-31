/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import {
  aggregationOptions,
  conditionOperatorOptions,
  getOptionsWithAdditionalValueIfMissing,
  rollupOptions,
  windowOptions
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { isPercentile } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { formatterTypeToValueLabel } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import { CustomEventSpecificationWithMetadata, Nullish, AlertingAggregation } from 'in-types';
import { MetricDefinition, getBuiltInMetricDefinition } from 'in-api/infraCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { FormatterType } from 'in-services/formatters/number';
import HelpAction from 'in-components/workspace/HelpAction';
import ComboBox, { Option } from 'in-components/ComboBox';
import FormGroup from 'in-settings/components/FormGroup';
import { Col } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

interface ThresholdsFormGroupProps {
  form: MapForm<any>;
  onChange: (
    fieldName: string,
    value: string | Nullish,
    updateFormDefinition?: (mapForm: MapForm<any>, entity: CustomEventSpecificationWithMetadata) => MapForm<any>
  ) => MapForm<any>;
  hideTimeWindow: boolean;
  disabled: boolean;
  entityType: string;
  metricName: string;
}

interface TimeWindowFormGroupProps {
  form: MapForm<any>;
  disabled: boolean;
  onChange: (
    fieldName: string,
    value: string | Nullish,
    updateFormDefinition?: (mapForm: MapForm<any>, entity: CustomEventSpecificationWithMetadata) => MapForm<any>
  ) => MapForm<any>;
  columnsSize?: number;
}

/**
 * How the layout (fitting into our 12-cells-grid) will look like:
 *
 * with hidden time window:
 *
 * | metric 50% | aggr 2/12 | oper 2/12 | val 2/12 |
 *
 *
 * with time window (together with compact layout)
 *
 * | metric 100% |
 * | timeWindow 3/12 | aggr 3/12 | oper 3/12 | val 3/12 |
 */
export function ThresholdsFormGroup({
  form,
  onChange,
  disabled,
  hideTimeWindow,
  entityType,
  metricName
}: ThresholdsFormGroupProps) {
  const isPercentileMetric = isPercentile(form);

  const defaultColSize = 3;
  const reducedColSizeForFitIntoRow = 2;
  const builtInMetricsForPlugin = useObservable<MetricDefinition, [string | undefined, string | undefined]>(() => {
    if (!(entityType && metricName)) {
      return null;
    }
    return getBuiltInMetricDefinition(entityType, metricName);
  }, [entityType, metricName]);

  const valueMappings = builtInMetricsForPlugin?.metricMetadata?.valueMappings;

  return (
    <>
      {!isPercentileMetric && !hideTimeWindow && (
        <TimeWindowFormGroup disabled={disabled} form={form} onChange={onChange} />
      )}

      {isPercentileMetric && !hideTimeWindow && (
        <Col lg={defaultColSize}>
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
        <Col lg={hideTimeWindow ? reducedColSizeForFitIntoRow : defaultColSize}>
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

      <Col lg={hideTimeWindow ? reducedColSizeForFitIntoRow : defaultColSize}>
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

      <Col lg={hideTimeWindow ? reducedColSizeForFitIntoRow : defaultColSize}>
        {(form.get('conditionValue') as Field<string>).map(field => (
          <FormGroup>
            <Stack direction="horizontal" align="start" gap="xxsmall">
              <Label htmlFor="event-conditionValue" hasError={!field.valid && field.touched}>
                {conditionLabel(
                  (form.get('formatter') as Field<FormatterType>).value,
                  (form.get('metricName') as Field<string>).value,
                  (form.get('aggregation') as Field<AlertingAggregation>)?.value
                )}
              </Label>
              {valueMappings && (
                <HelpAction size="xs">
                  <p>{t('in-settings:tabs.valueMapping')}</p>
                  <ul>
                    {Object.entries(valueMappings)
                      .sort(([, a], [, b]) => a - b)
                      .map(([stringValue, numericValue]) => (
                        <li key={numericValue}>
                          {numericValue}: {stringValue}
                        </li>
                      ))}
                  </ul>
                </HelpAction>
              )}
            </Stack>
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
    </>
  );
}

const conditionLabel = (formatterType: FormatterType, metricName: string, aggregation?: AlertingAggregation) => {
  if (aggregation === 'relative_diff') {
    return t('in-settings:tabs.relativeDifferencePercentage');
  }
  return formatterTypeToValueLabel(formatterType, metricName);
};

export function TimeWindowFormGroup({ form, disabled, onChange, columnsSize = 3 }: TimeWindowFormGroupProps) {
  return (
    <Col lg={columnsSize}>
      {(form.get('window') as Field<string>)?.map(field => (
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
  );
}
