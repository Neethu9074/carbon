/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { LoadingSkeleton, NumberInput, Stack, Typography } from '@instana/components';

import {
  calculateTimeWindowInMilliseconds,
  getSloWithMinDurationTimeWindow
} from 'in-alerting/smart-alerts/slo/form/utils';
import OperatorDropdown from 'in-service-levels/components/Shared/FormComponents/OperatorDropdown/OperatorDropdown';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import TimeOptionsDropdown from 'in-alerting/smart-alerts/slo/components/TimeOptionsDropdown';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { sloAlertThresholdOperators } from 'in-alerting/smart-alerts/slo/constants';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { Trans, t } from 'in-i18n';

import locals from './BurnRateBlueprintSectionContent.mless';

export default function BurnRateBlueprintSectionContent() {
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

  const longTimeWindowDurationField = form.getIn(['burnRateTimeWindows', 'longTimeWindow', 'duration']);
  const longTimeWindowUnitField = form.getIn(['burnRateTimeWindows', 'longTimeWindow', 'durationType']);
  const shortTimeWindowDurationField = form.getIn(['burnRateTimeWindows', 'shortTimeWindow', 'duration']);
  const shortTimeWindowUnitField = form.getIn(['burnRateTimeWindows', 'shortTimeWindow', 'durationType']);
  const thresholdField = form.getIn(['threshold']);
  const operatorField = form.getIn(['operator']);

  const longTimeWindowDurationValue = longTimeWindowDurationField.value;
  const shortTimeWindowDurationValue = shortTimeWindowDurationField.value;

  const isThresholdFieldValid = isFieldValid(thresholdField);
  const isShortTimeWindowDurationFieldValid = isFieldValid(shortTimeWindowDurationField);
  const isLongTimeWindowDurationFieldValid = isFieldValid(longTimeWindowDurationField);
  const isShortTimeWindowDurationUnitFieldValid = isFieldValid(shortTimeWindowUnitField);
  const isLongTimeWindowDurationUnitFieldValid = isFieldValid(longTimeWindowUnitField);

  const hasShortWindowBeenTouched = shortTimeWindowDurationField.touched || shortTimeWindowUnitField.touched;
  const hasLongWindowBeenTouched = longTimeWindowDurationField.touched || longTimeWindowUnitField.touched;

  const longTimeWindowDurationInMilliseconds = calculateTimeWindowInMilliseconds(
    longTimeWindowDurationValue,
    longTimeWindowUnitField.value
  );
  const shortTimeWindowDurationInMilliseconds = calculateTimeWindowInMilliseconds(
    shortTimeWindowDurationValue,
    shortTimeWindowUnitField.value
  );

  const burnRateForm = form.get('burnRateTimeWindows');
  const shouldShowShortWindowExceedsLongWindowError =
    shortTimeWindowDurationInMilliseconds > longTimeWindowDurationInMilliseconds &&
    longTimeWindowDurationValue !== 0 &&
    shortTimeWindowDurationValue !== 0 &&
    hasShortWindowBeenTouched &&
    hasLongWindowBeenTouched;

  return (
    <Stack gap="medium">
      <Stack gap="xsmall">
        <Typography variant="heading-200" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateLongWindowTitle')}
        </Typography>
        <Typography variant="body-small" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateLongWindowDescription')}
        </Typography>
        <Stack direction="horizontal" align="center">
          <Trans
            i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
            tOptions={{ context: 'BURN_RATE' }}
          >
            Evaluate the last
            <Stack direction="horizontal">
              <NumberInput
                size="md"
                className={locals.alertWindowInput}
                invalid={
                  longTimeWindowDurationValue > maxAllowedTimeWindow ||
                  !isLongTimeWindowDurationFieldValid ||
                  shouldShowShortWindowExceedsLongWindowError
                }
                value={longTimeWindowDurationValue}
                min={0}
                max={1000}
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(['burnRateTimeWindows', 'longTimeWindow', 'duration'], () =>
                    longTimeWindowDurationField.setValue(+value).setTouched(true)
                  );
                }}
                id="slo-alerting-burn-rate-long-window"
              />
              <TimeOptionsDropdown
                value={longTimeWindowUnitField.value}
                onChange={durationUnit => {
                  onChange(['burnRateTimeWindows', 'longTimeWindow', 'durationType'], () =>
                    longTimeWindowUnitField.setValue(durationUnit).setTouched(true)
                  );
                }}
              />
            </Stack>
            of the SLO.
          </Trans>
        </Stack>
        {longTimeWindowDurationInMilliseconds > maxAllowedTimeWindow && (
          <ValidationBlock>
            {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateTimeWindowTooLongError', {
              value: sloWithTheShortestTimeWindow?.name
            })}
          </ValidationBlock>
        )}
        {!isLongTimeWindowDurationUnitFieldValid &&
          longTimeWindowUnitField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
        {!isLongTimeWindowDurationFieldValid &&
          longTimeWindowDurationField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
      <Stack gap="xsmall">
        <Typography variant="heading-200" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateShortWindowTitle')}
        </Typography>
        <Typography variant="body-small" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateShortWindowDescription')}
        </Typography>
        <Stack direction="horizontal" align="center">
          <Trans
            i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
            tOptions={{ context: 'BURN_RATE' }}
          >
            Evaluate the last
            <Stack direction="horizontal">
              <NumberInput
                size="md"
                className={locals.alertWindowInput}
                invalid={
                  shortTimeWindowDurationInMilliseconds > maxAllowedTimeWindow ||
                  !isShortTimeWindowDurationFieldValid ||
                  shouldShowShortWindowExceedsLongWindowError
                }
                value={shortTimeWindowDurationValue}
                min={0}
                max={10000}
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(['burnRateTimeWindows', 'shortTimeWindow', 'duration'], () =>
                    shortTimeWindowDurationField.setValue(+value).setTouched(true)
                  );
                }}
                id="slo-alerting-burn-rate-short-window"
              />
              <TimeOptionsDropdown
                value={shortTimeWindowUnitField.value}
                onChange={durationUnit => {
                  onChange(['burnRateTimeWindows', 'shortTimeWindow', 'durationType'], () =>
                    shortTimeWindowUnitField.setValue(durationUnit).setTouched(true)
                  );
                }}
              />
            </Stack>
            of the SLO.
          </Trans>
        </Stack>
        {shortTimeWindowDurationInMilliseconds > maxAllowedTimeWindow && (
          <ValidationBlock>
            {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateTimeWindowTooLongError', {
              value: sloWithTheShortestTimeWindow?.name
            })}
          </ValidationBlock>
        )}
        {!isShortTimeWindowDurationFieldValid &&
          shortTimeWindowDurationField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
        {!isShortTimeWindowDurationUnitFieldValid &&
          shortTimeWindowUnitField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
        {shouldShowShortWindowExceedsLongWindowError &&
          burnRateForm.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
      <Stack gap="xsmall">
        <Typography variant="heading-200" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.thresholdTitle')}
        </Typography>
        <Stack direction="horizontal" align="center">
          <Trans
            i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.burnRateDescription"
            tOptions={{ context: 'BURN_RATE' }}
          >
            Notify me when the burn rate is
            <OperatorDropdown
              operators={sloAlertThresholdOperators}
              value={operatorField.value}
              onChange={operator => onChange(['operator'], () => operatorField.setValue(operator).setTouched(true))}
            />
            <NumberInput
              id="slo-alerting-burn-rate"
              invalid={!isThresholdFieldValid}
              value={thresholdField.value}
              min={0}
              max={100}
              onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
                onChange(['threshold'], () => thresholdField.setValue(+value).setTouched(true))
              }
            />
          </Trans>
        </Stack>
        {!isThresholdFieldValid &&
          thresholdField.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
    </Stack>
  );
}
