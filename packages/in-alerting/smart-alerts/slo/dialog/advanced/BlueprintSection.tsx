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
import { updateSloAlertNameAndDescription } from 'in-alerting/smart-alerts/slo/form/utils';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import PercentageInput from 'in-service-levels/components/PercentageInput';
import { SloAlertTypes } from 'in-alerting/smart-alerts/slo/types';
import { t } from 'in-i18n';

export default function BlueprintSection() {
  const { form, updateForm } = useSloAlertFormContext();

  const alertTypeField = form.getIn(['rule', 'alertType']);

  return (
    <TabSelect
      activePanelId={alertTypeField.value}
      onChange={newAlertType => {
        const updatedForm = form
          .updateIn(['rule', 'alertType'], alertTypeField => alertTypeField.setValue(newAlertType).setTouched(true))
          .updateIn(['rule', 'metric'], metricField =>
            metricField.setValue(newAlertType === 'ERROR_BUDGET' ? 'BURNED_PERCENTAGE' : 'STATUS').setTouched(true)
          )
          .updateIn(['operator'], operatorField =>
            operatorField.setValue(newAlertType === 'ERROR_BUDGET' ? '>=' : '<=').setTouched(true)
          );
        updateForm(updateSloAlertNameAndDescription(updatedForm));
      }}
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
          <BlueprintSectionPanel alertType="ERROR_BUDGET" />
        </TabSelectPanel>
        <TabSelectPanel<SloAlertTypes> id="SERVICE_LEVELS_OBJECTIVE">
          <BlueprintSectionPanel alertType="SERVICE_LEVELS_OBJECTIVE" />
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}

interface BlueprintSectionPanelProps {
  alertType: SloAlertTypes;
}

function BlueprintSectionPanel({ alertType }: BlueprintSectionPanelProps) {
  const { form, updateForm } = useSloAlertFormContext();

  const thresholdField = form.getIn(['threshold']);
  const isThresholdFieldValid = isFieldValid(thresholdField);

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
        <PercentageInput
          id="slo-alerting-threshold"
          value={thresholdField.value}
          onChange={value => {
            const updatedForm = form.updateIn(['threshold'], thresholdField =>
              thresholdField.setValue(value).setTouched(true)
            );
            updateForm(updateSloAlertNameAndDescription(updatedForm));
          }}
          hasError={!isThresholdFieldValid}
          decimalPrecision={2}
        />
        <Typography variant="body-regular" component="p" noMargin>
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.thresholdInputDescription', {
            context: alertType
          })}
        </Typography>
      </Stack>
      {!isThresholdFieldValid &&
        thresholdField.messages.map(({ message }, index) => (
          <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
        ))}
    </Stack>
  );
}
