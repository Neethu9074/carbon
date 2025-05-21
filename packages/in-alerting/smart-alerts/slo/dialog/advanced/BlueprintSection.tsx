/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import TabSelect, {
  TabSelectHeader,
  TabSelectItem,
  TabSelectMenu,
  TabSelectPanel,
  TabSelectPanels
} from 'in-components/TabSelect';
import OperatorDropdown from 'in-service-levels/components/Shared/FormComponents/OperatorDropdown/OperatorDropdown';
import BurnRateBlueprintSectionPanel from 'in-alerting/smart-alerts/slo/components/BurnRateBlueprintSectionPanel';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import BlueprintSectionPanel from 'in-alerting/smart-alerts/slo/components/BlueprintSectionPanel';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { sloAlertThresholdOperators } from 'in-alerting/smart-alerts/slo/constants';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import { SloAlertMetricTypes } from 'in-alerting/smart-alerts/slo/types';
import { Trans, t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/slo/dialog/advanced/BlueprintSection.mless';

export default function BlueprintSection() {
  const { form, onChange } = useSloAlertFormContext();

  const alertMetricField = form.getIn(['rule', 'metric']);
  const thresholdField = form.getIn(['threshold']);
  const operatorField = form.getIn(['operator']);

  const isThresholdFieldValid = isFieldValid(thresholdField);

  const alertMetricFieldValue = alertMetricField.value;

  return (
    <TabSelect
      activePanelId={alertMetricFieldValue}
      onChange={newAlertType => {
        if (alertMetricField.value === newAlertType) return;
        onChange(['rule', 'metric'], () => alertMetricField.setValue(newAlertType).setTouched(true));
      }}
    >
      <TabSelectHeader>
        <Typography variant="heading-200" noWrap noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprintSectionTitle')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem<SloAlertMetricTypes> forId="BURNED_PERCENTAGE">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
            context: 'BURNED_PERCENTAGE'
          })}
        </TabSelectItem>
        <TabSelectItem<SloAlertMetricTypes> forId="BURN_RATE_V2">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
            context: 'BURN_RATE_V2'
          })}
        </TabSelectItem>
        <TabSelectItem<SloAlertMetricTypes> forId="STATUS">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
            context: 'STATUS'
          })}
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel<SloAlertMetricTypes> id="BURNED_PERCENTAGE">
          <BlueprintSectionPanel>
            <Typography variant="body-regular" component="div" noMargin>
              <Stack gap="normal" direction="horizontal" align="center">
                <Trans
                  i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
                  tOptions={{ context: 'BURNED_PERCENTAGE' }}
                >
                  When
                  <OperatorDropdown
                    operators={sloAlertThresholdOperators}
                    value={operatorField.value}
                    onChange={operator =>
                      onChange(['operator'], () => operatorField.setValue(operator).setTouched(true))
                    }
                  />
                  <PercentageInput
                    id="slo-alerting-threshold"
                    value={thresholdField.value}
                    onChange={value => onChange(['threshold'], () => thresholdField.setValue(value).setTouched(true))}
                    hasError={!isThresholdFieldValid}
                    decimalPrecision={2}
                    className={locals.percentageInput}
                  />
                  percent of error budget is consumed
                </Trans>
              </Stack>
            </Typography>
          </BlueprintSectionPanel>
        </TabSelectPanel>
        <TabSelectPanel<SloAlertMetricTypes> id="BURN_RATE_V2">
          <BurnRateBlueprintSectionPanel />
        </TabSelectPanel>
        <TabSelectPanel<SloAlertMetricTypes> id="STATUS">
          <BlueprintSectionPanel>
            <Typography variant="body-regular" component="div" noMargin>
              <Stack gap="normal" direction="horizontal" align="center">
                <Trans
                  i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
                  tOptions={{ context: 'STATUS' }}
                >
                  When SLO target is
                  <OperatorDropdown
                    operators={sloAlertThresholdOperators}
                    value={operatorField.value}
                    onChange={operator =>
                      onChange(['operator'], () => operatorField.setValue(operator).setTouched(true))
                    }
                  />
                  <PercentageInput
                    id="slo-alerting-threshold"
                    value={thresholdField.value}
                    onChange={value => onChange(['threshold'], () => thresholdField.setValue(value).setTouched(true))}
                    hasError={!isThresholdFieldValid}
                    decimalPrecision={2}
                    className={locals.percentageInput}
                  />
                </Trans>
              </Stack>
            </Typography>
          </BlueprintSectionPanel>
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}
