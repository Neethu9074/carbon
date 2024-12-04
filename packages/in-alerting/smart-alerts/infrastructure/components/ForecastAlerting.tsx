/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Toggle, PreviewPill, Typography } from '@instana/components';
import { ForecastingConfig } from '@instana/types';

import ConfigureForecastTimeframe from 'in-alerting/smart-alerts/infrastructure/components/ConfigureForecastTimeframe';
import ConfigureFitTimeframe from 'in-alerting/smart-alerts/infrastructure/components/ConfigureFitTimeframe';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { formatDurationAccurately } from 'in-services/formatters/date';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { hours } from 'in-services/time';
import { t, Trans } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/ForecastAlerting.mless';
import toogleLocals from 'in-alerting/smart-alerts/components/dialog/advanced/Toogle.mless';

interface ForecastAlertingProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}

export const defaultForecastingConfig: ForecastingConfig = Object.freeze({
  fitTimeframe: hours.toMillis(24),
  forecastTimeframe: hours.toMillis(1)
});

export default function ForecastAlerting({ form, updateForm }: ForecastAlertingProps) {
  const forecastingConfig = form.get('forecastingConfig')?.value;
  const enabled = forecastingConfig != null;

  return (
    <BorderedContainer>
      <div className={locals.container}>
        <HorizontalFlexWrapper>
          <h3 className={locals.headline}>
            {t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.title')}
          </h3>
          <PreviewPill className={locals.previewPill} />
        </HorizontalFlexWrapper>
        <Toggle
          className={toogleLocals.toggleDialogUsage}
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
        <div className={locals.description}>
          <Typography variant="body-small" component="div">
            {t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.description')}
          </Typography>
        </div>
        {enabled && (
          <div className={locals.content}>
            <BorderedContainer>
              <ConfigureFitTimeframe form={form} updateForm={updateForm} />
              <TouchedMessages className={locals.timeframeError} field={form.get('forecastingConfig')} />
              <ConfigureForecastTimeframe form={form} updateForm={updateForm} />
              <span className={locals.summary}>
                <Trans
                  i18nKey="in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.summary"
                  values={{
                    fitTimeframe: formatTime(forecastingConfig.fitTimeframe),
                    forecastTimeframe: formatTime(forecastingConfig.forecastTimeframe)
                  }}
                />
              </span>
            </BorderedContainer>
          </div>
        )}
      </div>
    </BorderedContainer>
  );
}

export function formatTime(millis: number) {
  return formatDurationAccurately(millis, 60000, false);
}
