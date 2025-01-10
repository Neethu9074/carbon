/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field } from 'formalistic';
import React, { useEffect } from 'react';

import { ForecastingConfig } from '@instana/types';
import { Select } from '@instana/components';

import { ForecastAlertingWrapper } from 'in-alerting/smart-alerts/components/tearSheet/CustomWrappers/Wrapper';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/ConfigureForecastTimeframe.mless';

const MAX_STEPS_AHEAD = 10;

export interface ConfigureForecastTimeframeProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  isTearSheet?: boolean;
}

export default function ConfigureForecastTimeframe({ form, updateForm, isTearSheet }: ConfigureForecastTimeframeProps) {
  const granularity = form.get('granularity').value;
  const forecastingConfigField = form.get('forecastingConfig') as Field<ForecastingConfig>;
  const forecastTimeframe = forecastingConfigField.value.forecastTimeframe;

  const handleForecastTimeframeChange = (optionValue: number) => {
    if (!updateForm) {
      return;
    }

    const updatedForecastingConfig = {
      ...forecastingConfigField.toJS(),
      forecastTimeframe: optionValue * granularity
    } as ForecastingConfig;

    updateForm(
      form.updateIn(['forecastingConfig'], f =>
        (f as Field<ForecastingConfig>).setValue(updatedForecastingConfig).setTouched(true)
      )
    );
  };

  const options = getOptions(granularity);
  const selectedOption = forecastTimeframe / granularity;

  useEffect(() => {
    if (!isSelectedTimeExists(selectedOption, granularity)) {
      handleForecastTimeframeChange(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, granularity]);

  if (isTearSheet) {
    return (
      <ForecastAlertingWrapper
        title={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.forecastTimeframe')}
        description={t(
          'in-alerting:smartAlerts.infrastructure.tearSheet.forecastAlerting.forecastedTimeWindow.description'
        )}
        tooltipContent={t(
          'in-alerting:smartAlerts.infrastructure.tearSheet.forecastAlerting.forecastedTimeWindow.tooltipContent'
        )}
        tooltipIcon="lib_help_error_info_outline"
      >
        <Select value={selectedOption} onChange={e => handleForecastTimeframeChange(Number(e.target.value))}>
          <>
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </>
        </Select>
      </ForecastAlertingWrapper>
    );
  }

  return (
    <div>
      <SelectInSection
        label={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.forecastTimeframe')}
        id="metric-configurator-infra-aggregation"
        className={locals.content}
        value={selectedOption}
        onChange={e => handleForecastTimeframeChange(Number(e.target.value))}
        additionalContent={
          <div className={locals.detail}>
            {t(
              'in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.forecastTimeframeDetails'
            )}
          </div>
        }
      >
        <>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </>
      </SelectInSection>
    </div>
  );
}

interface Option {
  value: number;
  label: string;
}

function getOptions(granularity: number) {
  const options: Option[] = [];
  for (let i = 1; i <= MAX_STEPS_AHEAD; ++i) {
    options.push({
      value: i,
      label: formatDurationAccurately(i * granularity, 60000, false) ?? ''
    });
  }
  return options;
}

function isSelectedTimeExists(selectedOption: number, granularity: number) {
  const options = getOptions(granularity);
  const formattedTime = formatDurationAccurately(selectedOption * granularity, 60000, false);
  return options.find(option => option.label === formattedTime);
}
