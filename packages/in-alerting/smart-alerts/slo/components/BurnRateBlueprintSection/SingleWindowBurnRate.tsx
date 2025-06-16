/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { LoadingSkeleton, NumberInput, Stack, Typography } from '@instana/components';
import { ServiceLevelsBurnRateConfig } from '@instana/types';

import {
  calculateTimeWindowInMilliseconds,
  getSloWithMinDurationTimeWindow
} from 'in-alerting/smart-alerts/slo/form/utils';
import OperatorDropdown from 'in-service-levels/components/Shared/FormComponents/OperatorDropdown/OperatorDropdown';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import TimeOptionsDropdown from 'in-alerting/smart-alerts/slo/components/TimeOptionsDropdown';
import { sloAlertThresholdOperators } from 'in-alerting/smart-alerts/slo/constants';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { isFieldValid } from 'in-service-levels/utils/form';
import { Trans, t } from 'in-i18n';

import locals from './BurnRateBlueprintSection.mless';

export default function SingleWindowBurnRate() {
  const { form, onChange } = useSloAlertFormContext();

  const sloIdsField = form.getIn(['sloIds']);

  const [items, status] = useSloConfigurations({
    ids: sloIdsField.value
  });

  const loading = status === 'pending';

  if (loading) return <LoadingSkeleton />;

  const fetchedSlos = items?.items;

  const sloWithTheShortestTimeWindow = getSloWithMinDurationTimeWindow(fetchedSlos ?? []);
  const maxAllowedTimeWindow = calculateTimeWindowInMilliseconds(
    sloWithTheShortestTimeWindow?.timeWindow.duration ?? 0,
    sloWithTheShortestTimeWindow?.timeWindow.durationUnit ?? 'millisecond'
  );

  const burnRateConfig = (form.getIn(['burnRateConfig']).toJS() as ServiceLevelsBurnRateConfig[]) ?? [];
  const singleWindowBurnRateFormIndex = burnRateConfig.findIndex(item => item?.alertWindowType === 'SINGLE');

  if (singleWindowBurnRateFormIndex < 0) return null;

  const alertTimeWindowDurationField = form.getIn(['burnRateConfig', singleWindowBurnRateFormIndex, 'duration']);
  const alertTimeWindowDurationValue = alertTimeWindowDurationField.value;
  const isSingleTimeWindowDurationFieldValid = isFieldValid(alertTimeWindowDurationField);

  const alertTimeWindowDurationTypeField = form.getIn([
    'burnRateConfig',
    singleWindowBurnRateFormIndex,
    'durationUnitType'
  ]);
  const alertTimeWindowDurationTypeValue = alertTimeWindowDurationTypeField.value;
  const isAlertTimeWindowDurationUnitFieldValid = isFieldValid(alertTimeWindowDurationTypeField);

  const burnRateAlertOperatorField = form.getIn([
    'burnRateConfig',
    singleWindowBurnRateFormIndex,
    'threshold',
    'operator'
  ]);
  const burnRateAlertThresholdField = form.getIn([
    'burnRateConfig',
    singleWindowBurnRateFormIndex,
    'threshold',
    'value'
  ]);
  const isAlertThresholdFieldValid = isFieldValid(burnRateAlertThresholdField);

  const alertTimeWindowDurationInMilliseconds = calculateTimeWindowInMilliseconds(
    alertTimeWindowDurationValue,
    alertTimeWindowDurationTypeValue
  );

  return (
    <Stack gap="medium">
      <Stack gap="xsmall">
        <Typography variant="heading-200" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateWindowTitle', { context: 'SINGLE_WINDOW' })}
        </Typography>
        <Typography variant="body-small" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateSingleWindowDescription')}
        </Typography>
        <Stack direction="horizontal" align="center">
          <Trans
            i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
            tOptions={{ context: 'BURN_RATE_V2' }}
          >
            Evaluate the last
            <Stack direction="horizontal">
              <NumberInput
                size="md"
                className={locals.alertWindowInput}
                invalid={alertTimeWindowDurationValue > maxAllowedTimeWindow || !isSingleTimeWindowDurationFieldValid}
                value={alertTimeWindowDurationValue}
                min={0}
                max={1000}
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(['burnRateConfig', singleWindowBurnRateFormIndex, 'duration'], () =>
                    alertTimeWindowDurationField.setValue(+value).setTouched(true)
                  )
                }
                id="slo-alerting-burn-rate-long-window"
              />
              <TimeOptionsDropdown
                value={alertTimeWindowDurationTypeValue}
                onChange={durationUnit => {
                  onChange(['burnRateConfig', singleWindowBurnRateFormIndex, 'durationUnitType'], () =>
                    alertTimeWindowDurationTypeField.setValue(durationUnit).setTouched(true)
                  );
                }}
              />
            </Stack>
            of the SLO.
          </Trans>
        </Stack>
        {alertTimeWindowDurationInMilliseconds > maxAllowedTimeWindow && (
          <ValidationBlock>
            {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateTimeWindowTooLongError', {
              value: sloWithTheShortestTimeWindow?.name
            })}
          </ValidationBlock>
        )}
        {!isAlertTimeWindowDurationUnitFieldValid &&
          alertTimeWindowDurationTypeField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
        {!isSingleTimeWindowDurationFieldValid &&
          alertTimeWindowDurationField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
      <Stack gap="medium">
        <Typography variant="heading-200" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.thresholdTitle')}
        </Typography>
        <Stack direction="horizontal" align="center">
          <Trans
            i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.burnRateDescription"
            tOptions={{ context: 'BURN_RATE_V2' }}
          >
            Notify me when the burn rate is
            <OperatorDropdown
              operators={sloAlertThresholdOperators}
              value={burnRateAlertOperatorField.value}
              onChange={operator =>
                onChange(['burnRateConfig', singleWindowBurnRateFormIndex, 'threshold', 'operator'], () =>
                  burnRateAlertOperatorField.setValue(operator).setTouched(true)
                )
              }
            />
            <NumberInput
              id="slo-alerting-burn-rate"
              invalid={!isAlertThresholdFieldValid}
              value={burnRateAlertThresholdField.value}
              min={0}
              max={100}
              onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
                onChange(['burnRateConfig', singleWindowBurnRateFormIndex, 'threshold', 'value'], () =>
                  burnRateAlertThresholdField.setValue(+value).setTouched(true)
                )
              }
            />
          </Trans>
        </Stack>
        {!isAlertThresholdFieldValid &&
          burnRateAlertThresholdField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
    </Stack>
  );
}
