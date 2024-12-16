/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';

import ThresholdValueInput from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdValueInput';
import { MetricDefinition, getBuiltInMetricDefinition } from 'in-api/infraCatalog';
import HelpAction from 'in-components/workspace/HelpAction/HelpAction';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/ThresholdCondition.mless';

export interface ThresholdValueInputWithValidationMessageProps {
  max: number;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  percentageMetric: boolean;
  metricUnitPostfix: string;
  isSmall?: boolean;
  isTearSheet?: boolean;
  thresholdField?: Field<any>;
  getUpdatedForm?: (targetValue: number | null) => MapForm<any>;
  isMultiThreshold?: boolean;
  id?: string;
}

export default function ThresholdValueInputWithValidationMessage(props: ThresholdValueInputWithValidationMessageProps) {
  const { thresholdField = props.form?.get('threshold')?.get('value') } = props;
  const metricId = props.form.get('rule')?.get('metricName')?.value ?? undefined;
  const plugin = props.form.get('rule')?.get('entityType')?.value ?? undefined;

  const builtInMetricsForPlugin = useObservable<MetricDefinition, [string | undefined, string | undefined]>(() => {
    if (plugin && metricId) {
      return getBuiltInMetricDefinition(plugin, metricId);
    } else {
      return null;
    }
  }, [plugin, metricId]);

  const valueMappings = builtInMetricsForPlugin?.metricMetadata?.valueMappings;

  return (
    <div
      className={classNames({
        [locals.multiThresholdValueWithValidationMessage]: props.isMultiThreshold
      })}
    >
      <div className={locals.toolTip}>
        <ThresholdValueInput {...props} />
        {valueMappings && (
          <HelpAction>
            <p>{t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.valueMappings')}</p>
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
      </div>
      <TouchedMessages field={thresholdField} />
    </div>
  );
}
