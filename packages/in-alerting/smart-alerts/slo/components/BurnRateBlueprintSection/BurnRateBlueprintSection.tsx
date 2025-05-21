/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useRef } from 'react';

import { RadioButton, Stack, Typography } from '@instana/components';
import { ServiceLevelsBurnRateConfig } from '@instana/types';

import SingleWindowBurnRate from 'in-alerting/smart-alerts/slo/components/BurnRateBlueprintSection/SingleWindowBurnRate';
import MultiWindowBurnRate from 'in-alerting/smart-alerts/slo/components/BurnRateBlueprintSection/MultiWindowBurnRate';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { createBurnRateAlertConfig } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import { defaultSloAlertConfig } from 'in-alerting/smart-alerts/slo/data/sloAlertConfig';
import { t } from 'in-i18n';

export default function BurnRateBlueprintSection() {
  const { form, onChange } = useSloAlertFormContext();

  const burnRateAlertTypeField = form.getIn(['burnRateAlertType']);
  const burnRateConfig = form.getIn(['burnRateConfig']);
  const burnRateConfigRef = useRef(false);

  const burnRateAlertTypeFieldValue = burnRateAlertTypeField?.value;
  const burnRateBluePrintValue = form.getIn(['rule', 'metric']).value;
  const isBurnRateBluePrint = burnRateBluePrintValue === 'BURN_RATE_V2';

  useEffect(() => {
    if (!burnRateConfigRef.current) {
      burnRateConfigRef.current = true;
      return;
    }

    if (!isBurnRateBluePrint) return;

    const currentBurnRateConfig: ServiceLevelsBurnRateConfig[] =
      (burnRateConfig?.toJS() as ServiceLevelsBurnRateConfig[]) ?? [];

    const sourceConfigs =
      currentBurnRateConfig.length > 0 ? currentBurnRateConfig : defaultSloAlertConfig.burnRateConfig!;

    onChange(['burnRateConfig'], () =>
      createBurnRateAlertConfig(sourceConfigs, burnRateAlertTypeField.value, isBurnRateBluePrint)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burnRateAlertTypeField?.value, isBurnRateBluePrint]);

  return (
    <Stack gap="medium">
      <Typography variant="heading-200" component="p" noMargin>
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateAlertTypeLabel')}
      </Typography>
      <Stack gap="medium" direction="horizontal">
        <RadioButton
          label={t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateAlertTypeLabel', {
            context: 'SINGLE_WINDOW'
          })}
          checked={burnRateAlertTypeFieldValue === 'single'}
          onChange={() =>
            onChange(['burnRateAlertType'], () => burnRateAlertTypeField.setValue('single').setTouched(true))
          }
        />
        <RadioButton
          label={t('in-alerting:smartAlerts.slo.advancedModeContainer.burnRateAlertTypeLabel', {
            context: 'MULTI_WINDOW'
          })}
          checked={burnRateAlertTypeFieldValue === 'multi'}
          onChange={() =>
            onChange(['burnRateAlertType'], () => burnRateAlertTypeField.setValue('multi').setTouched(true))
          }
        />
      </Stack>
      <Stack gap="xsmall">
        {burnRateAlertTypeFieldValue === 'single' ? <SingleWindowBurnRate /> : <MultiWindowBurnRate />}
      </Stack>
    </Stack>
  );
}
