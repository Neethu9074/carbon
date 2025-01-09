/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Spacer, Stack, Toggle } from '@instana/components';
import { ForecastingConfig } from '@instana/types';

import {
  defaultForecastingConfig,
  formatTime
} from 'in-alerting/smart-alerts/infrastructure/components/ForecastAlerting';
import ConfigureForecastTimeframe from 'in-alerting/smart-alerts/infrastructure/components/ConfigureForecastTimeframe';
import ConfigureFitTimeframe from 'in-alerting/smart-alerts/infrastructure/components/ConfigureFitTimeframe';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t, Trans } from 'in-i18n';

export default function ForecastAlerting({
  form,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}) {
  const forecastingConfig = form.get('forecastingConfig')?.value;
  const enabled = forecastingConfig != null;

  return (
    <TearSheetStepTitleWrapper
      headline={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.title')}
      hideSpace
    >
      <Stack direction="vertical" gap="xsmall">
        <Toggle
          checked={enabled}
          labelB={t('in-alerting:components.on')}
          labelA={t('in-alerting:components.off')}
          size="sm"
          onToggle={enabled => {
            if (!updateForm) {
              return;
            }

            const value = enabled ? defaultForecastingConfig : null;
            updateForm(
              form.updateIn(['forecastingConfig'], f =>
                (f as Field<ForecastingConfig | null>).setValue(value).setTouched(true)
              )
            );
          }}
        />

        <AlertTypography
          variant="label-01"
          color="color600"
          content={t('in-alerting:smartAlerts.infrastructure.tearSheet.forecastAlerting.description')}
        />
        {enabled && (
          <>
            <Spacer size="small" />
            <Stack direction="vertical" gap="normal">
              <ConfigureFitTimeframe form={form} updateForm={updateForm} isTearSheet />
              <TouchedMessages field={form.get('forecastingConfig')} />
              <ConfigureForecastTimeframe form={form} updateForm={updateForm} isTearSheet />
              <AlertTypography
                color="color900"
                content={
                  <Trans
                    i18nKey="in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.summary"
                    values={{
                      fitTimeframe: formatTime(forecastingConfig.fitTimeframe),
                      forecastTimeframe: formatTime(forecastingConfig.forecastTimeframe)
                    }}
                  />
                }
                variant="body-small"
              />
            </Stack>
          </>
        )}
      </Stack>
    </TearSheetStepTitleWrapper>
  );
}
