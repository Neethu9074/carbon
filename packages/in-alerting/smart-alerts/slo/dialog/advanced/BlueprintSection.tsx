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
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import OperatorDropdown from 'in-alerting/smart-alerts/slo/components/OperatorDropdown';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import { SloAlertTypes } from 'in-alerting/smart-alerts/slo/types';
import { Trans, t } from 'in-i18n';

import locals from './BlueprintSection.mless';

export default function BlueprintSection() {
  const { form, onChange } = useSloAlertFormContext();

  const alertTypeField = form.getIn(['rule', 'alertType']);
  const thresholdField = form.getIn(['threshold']);
  const operatorField = form.getIn(['operator']);

  const isThresholdFieldValid = isFieldValid(thresholdField);

  return (
    <TabSelect
      activePanelId={alertTypeField.value}
      onChange={newAlertType =>
        onChange(['rule', 'alertType'], () => alertTypeField.setValue(newAlertType).setTouched(true))
      }
    >
      <TabSelectHeader>
        <Typography variant="heading-200" noWrap noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprintSectionTitle')}
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem<SloAlertTypes> forId="ERROR_BUDGET">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
            context: 'ERROR_BUDGET'
          })}
        </TabSelectItem>
        <TabSelectItem<SloAlertTypes> forId="SERVICE_LEVELS_OBJECTIVE">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
            context: 'SERVICE_LEVELS_OBJECTIVE'
          })}
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel<SloAlertTypes> id="ERROR_BUDGET">
          <BlueprintSectionPanel alertType="ERROR_BUDGET">
            <Typography variant="body-regular" component="div" noMargin>
              <Trans
                i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
                tOptions={{ context: 'ERROR_BUDGET' }}
              >
                When
                <OperatorDropdown
                  value={operatorField.value}
                  onChange={operator => onChange(['operator'], () => operatorField.setValue(operator).setTouched(true))}
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
            </Typography>
          </BlueprintSectionPanel>
        </TabSelectPanel>
        <TabSelectPanel<SloAlertTypes> id="SERVICE_LEVELS_OBJECTIVE">
          <BlueprintSectionPanel alertType="SERVICE_LEVELS_OBJECTIVE">
            <Typography variant="body-regular" component="div" noMargin>
              <Trans
                i18nKey="in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription"
                tOptions={{ context: 'SERVICE_LEVELS_OBJECTIVE' }}
              >
                When SLO target is
                <OperatorDropdown
                  value={operatorField.value}
                  onChange={operator => onChange(['operator'], () => operatorField.setValue(operator).setTouched(true))}
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
            </Typography>
          </BlueprintSectionPanel>
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}

interface BlueprintSectionPanelProps {
  alertType: SloAlertTypes;
}

function BlueprintSectionPanel({ alertType, children }: React.PropsWithChildren<BlueprintSectionPanelProps>) {
  const { form } = useSloAlertFormContext();

  const thresholdField = form.getIn(['threshold']);
  const operatorField = form.getIn(['operator']);
  const isThresholdFieldValid = isFieldValid(thresholdField);
  const isOperatorFieldValid = isFieldValid(operatorField);

  return (
    <Stack gap="xsmall">
      <Typography variant="heading-200" component="h2" noMargin>
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
          context: alertType
        })}
      </Typography>
      <Typography variant="body-small" component="p">
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprintDescription', {
          context: alertType
        })}
      </Typography>
      <Typography variant="heading-200" component="p" noMargin>
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.thresholdTitle')}
      </Typography>
      <Stack gap="normal" direction="horizontal" align="center">
        {children}
      </Stack>
      {!isThresholdFieldValid &&
        thresholdField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
      {!isOperatorFieldValid &&
        operatorField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
