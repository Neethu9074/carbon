/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';
import React from 'react';

import { ForecastingConfig } from '@instana/types';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { hours, days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/ConfigureFitTimeframe.mless';

export interface ConfigureFitTimeframeProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}

interface Option {
  value: number;
  label: string;
}

const timeframeOptions: readonly Option[] = Object.freeze([
  {
    value: hours.toMillis(1),
    label: formatDurationAccurately(hours.toMillis(1), 60000, false) ?? ''
  },
  {
    value: hours.toMillis(2),
    label: formatDurationAccurately(hours.toMillis(2), 60000, false) ?? ''
  },
  {
    value: hours.toMillis(3),
    label: formatDurationAccurately(hours.toMillis(3), 60000, false) ?? ''
  },
  {
    value: hours.toMillis(4),
    label: formatDurationAccurately(hours.toMillis(4), 60000, false) ?? ''
  },
  {
    value: hours.toMillis(6),
    label: formatDurationAccurately(hours.toMillis(6), 60000, false) ?? ''
  },
  {
    value: hours.toMillis(12),
    label: formatDurationAccurately(hours.toMillis(12), 60000, false) ?? ''
  },
  {
    value: days.toMillis(1),
    label: formatDurationAccurately(days.toMillis(1), 60000, false) ?? ''
  },
  {
    value: days.toMillis(2),
    label: formatDurationAccurately(days.toMillis(2), 60000, false) ?? ''
  },
  {
    value: days.toMillis(3),
    label: formatDurationAccurately(days.toMillis(3), 60000, false) ?? ''
  },
  {
    value: days.toMillis(7),
    label: formatDurationAccurately(days.toMillis(7), 60000, false) ?? ''
  }
]);

export default function ConfigureFitTimeframe({ form, updateForm }: ConfigureFitTimeframeProps) {
  const forecastingConfigField = form.get('forecastingConfig') as Field<ForecastingConfig>;
  const fitTimeframe = forecastingConfigField.value.fitTimeframe;

  const handleFitTimeframeChange = (optionValue: number) => {
    if (!updateForm) {
      return;
    }

    const updatedForecastingConfig = {
      ...forecastingConfigField.toJS(),
      fitTimeframe: optionValue
    } as ForecastingConfig;

    updateForm(
      form.updateIn(['forecastingConfig'], f =>
        (f as Field<ForecastingConfig>).setValue(updatedForecastingConfig).setTouched(true)
      )
    );
  };

  return (
    <div>
      <SelectInSection
        label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.fitTimeframe')}
        id="metric-configurator-infra-aggregation"
        className={locals.content}
        value={fitTimeframe}
        onChange={e => handleFitTimeframeChange(Number(e.target.value))}
        additionalContent={
          <div className={locals.detail}>
            {t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.fitTimeframeDetails')}
          </div>
        }
      >
        <>
          {timeframeOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </>
      </SelectInSection>
    </div>
  );
}
