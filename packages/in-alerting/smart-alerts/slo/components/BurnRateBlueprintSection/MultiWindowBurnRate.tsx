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

export default function MultiWindowBurnRate() {
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
  const longWindowBurnRateFormIndex = burnRateConfig.findIndex(item => item?.alertWindowType === 'LONG');
  const shortWindowBurnRateFormIndex = burnRateConfig.findIndex(item => item?.alertWindowType === 'SHORT');

  if (shortWindowBurnRateFormIndex < 0 || longWindowBurnRateFormIndex < 0) return null;

  const longTimeWindowDurationField = form.getIn(['burnRateConfig', longWindowBurnRateFormIndex, 'duration']);
  const longTimeWindowUnitField = form.getIn(['burnRateConfig', longWindowBurnRateFormIndex, 'durationUnitType']);
  const shortTimeWindowDurationField = form.getIn(['burnRateConfig', shortWindowBurnRateFormIndex, 'duration']);
  const shortTimeWindowUnitField = form.getIn(['burnRateConfig', shortWindowBurnRateFormIndex, 'durationUnitType']);

  const longWindowThreshold = form.getIn(['burnRateConfig', longWindowBurnRateFormIndex, 'threshold', 'value']);
  const shortWindowThreshold = form.getIn(['burnRateConfig', shortWindowBurnRateFormIndex, 'threshold', 'value']);
  const isLongWindowThresholdFieldValid = isFieldValid(longWindowThreshold);
  const isShortWindowThresholdFieldValid = isFieldValid(shortWindowThreshold);

  const longWindowOperatorField = form.getIn(['burnRateConfig', longWindowBurnRateFormIndex, 'threshold', 'operator']);
  const shortWindowOperatorField = form.getIn([
    'burnRateConfig',
    shortWindowBurnRateFormIndex,
    'threshold',
    'operator'
  ]);

  const longTimeWindowDurationValue = longTimeWindowDurationField.value;
  const shortTimeWindowDurationValue = shortTimeWindowDurationField.value;

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

  const burnRateForm = form.get('burnRateConfig');
  const shouldShowShortWindowExceedsLongWindowError =
    shortTimeWindowDurationInMilliseconds >= longTimeWindowDurationInMilliseconds &&
    longTimeWindowDurationValue !== 0 &&
    shortTimeWindowDurationValue !== 0 &&
    hasShortWindowBeenTouched &&
    hasLongWindowBeenTouched;

  return (
    <Stack gap="medium">
      <Stack gap="xsmall">
        <Typography variant="heading-200" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateWindowTitle', { context: 'MULTI_WINDOW' })}
        </Typography>
        <Typography variant="body-small" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateLongWindowDescription')}
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
                invalid={
                  longTimeWindowDurationValue > maxAllowedTimeWindow ||
                  !isLongTimeWindowDurationFieldValid ||
                  shouldShowShortWindowExceedsLongWindowError
                }
                value={longTimeWindowDurationValue}
                min={0}
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(['burnRateConfig', longWindowBurnRateFormIndex, 'duration'], () =>
                    longTimeWindowDurationField.setValue(+value).setTouched(true)
                  );
                }}
                id="slo-alerting-burn-rate-long-window"
              />
              <TimeOptionsDropdown
                value={longTimeWindowUnitField.value}
                onChange={durationUnit => {
                  onChange(['burnRateConfig', longWindowBurnRateFormIndex, 'durationUnitType'], () =>
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
              value={longWindowOperatorField.value}
              onChange={operator =>
                onChange(['burnRateConfig', longWindowBurnRateFormIndex, 'threshold', 'operator'], () =>
                  longWindowOperatorField.setValue(operator).setTouched(true)
                )
              }
            />
            <NumberInput
              id="slo-long-window-alerting-burn-rate"
              invalid={!isLongWindowThresholdFieldValid}
              value={longWindowThreshold.value}
              min={0}
              onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
                onChange(['burnRateConfig', longWindowBurnRateFormIndex, 'threshold', 'value'], () =>
                  longWindowThreshold.setValue(+value).setTouched(true)
                )
              }
            />
          </Trans>
        </Stack>
        {!isLongWindowThresholdFieldValid &&
          longWindowThreshold.messages.map(({ message }, index) => (
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
            tOptions={{ context: 'BURN_RATE_V2' }}
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
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(['burnRateConfig', shortWindowBurnRateFormIndex, 'duration'], () =>
                    shortTimeWindowDurationField.setValue(+value).setTouched(true)
                  );
                }}
                id="slo-alerting-burn-rate-short-window"
              />
              <TimeOptionsDropdown
                value={shortTimeWindowUnitField.value}
                onChange={durationUnit => {
                  onChange(['burnRateConfig', shortWindowBurnRateFormIndex, 'durationUnitType'], () =>
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
            tOptions={{ context: 'BURN_RATE_V2' }}
          >
            Notify me when the burn rate is
            <OperatorDropdown
              operators={sloAlertThresholdOperators}
              value={shortWindowOperatorField.value}
              onChange={operator =>
                onChange(['burnRateConfig', shortWindowBurnRateFormIndex, 'threshold', 'operator'], () =>
                  shortWindowOperatorField.setValue(operator).setTouched(true)
                )
              }
            />
            <NumberInput
              id="slo-short-window-alerting-burn-rate"
              invalid={!isShortWindowThresholdFieldValid}
              value={shortWindowThreshold.value}
              min={0}
              onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
                onChange(['burnRateConfig', shortWindowBurnRateFormIndex, 'threshold', 'value'], () =>
                  shortWindowThreshold.setValue(+value).setTouched(true)
                )
              }
            />
          </Trans>
        </Stack>
        {!isShortWindowThresholdFieldValid &&
          shortWindowThreshold.messages.map(({ message }, index) => (
            <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
          ))}
      </Stack>
    </Stack>
  );
}
