/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl,
  SlideInConfig
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import AlertPropertiesSection from 'in-alerting/smart-alerts/slo/dialog/advanced/AlertPropertiesSection';
import AlertChannelsSection from 'in-alerting/smart-alerts/slo/dialog/advanced/AlertChannelsSection';
import TimeThresholdSection from 'in-alerting/smart-alerts/slo/dialog/advanced/TimeThresholdSection';
import CustomPayloadSection from 'in-alerting/smart-alerts/slo/dialog/advanced/CustomPayloadSection';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import BlueprintSection from 'in-alerting/smart-alerts/slo/dialog/advanced/BlueprintSection';
import SloTargetSection from 'in-alerting/smart-alerts/slo/dialog/advanced/SloTargetSection';
import { isFieldValid } from 'in-service-levels/utils/form';
import StepsContainer from 'in-components/StepsContainer';
import { MessageType } from 'in-components/MessageStack';
import { NavItem } from 'in-components/SideNav/SideNav';
import { t } from 'in-i18n';

interface AdvancedModeContainerProps extends AlertConfigDialogPresenterProps, MainDialogControl, SlideInConfig {
  messages?: MessageType[];
}

export default function AdvancedModeContainer({
  messages,
  setSliderState,
  setCustomSlideInHeaderConfig
}: AdvancedModeContainerProps) {
  const { form } = useSloAlertFormContext();

  const sloIdsField = form.getIn(['sloIds']);
  const alertTypeField = form.getIn(['rule', 'alertType']);
  const thresholdField = form.getIn(['threshold']);
  const alertChannelsField = form.getIn(['alertChannelIds']);
  const nameField = form.getIn(['name']);
  const descriptionField = form.getIn(['description']);
  const timeThresholdField = form.getIn(['timeThreshold', 'timeWindow']);
  const customPayloadFieldsField = form.getIn(['customPayloadFields']);

  const sloIdsFieldValid = isFieldValid(sloIdsField);
  const isAlertTypeValid = isFieldValid(alertTypeField);
  const isThresholdValid = isFieldValid(thresholdField);
  const areAlertChannelsValid = isFieldValid(alertChannelsField);
  const isNameValid = isFieldValid(nameField);
  const isDescriptionValid = isFieldValid(descriptionField);
  const isTimeThresholdValid = isFieldValid(timeThresholdField);
  const isCustomPayloadFieldsValid = isFieldValid(customPayloadFieldsField);

  const navItems: Array<NavItem> = [
    {
      scrollId: '0-slo-target',
      label: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepLabel', { context: 'sloTarget' }),
      title: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepTitle', { context: 'sloTarget' }),
      content: <SloTargetSection />,
      valid: sloIdsFieldValid
    },
    {
      scrollId: '1-select-blueprint',
      label: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepLabel', { context: 'trigger' }),
      title: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepTitle', { context: 'trigger' }),
      content: <BlueprintSection />,
      valid: isAlertTypeValid && isThresholdValid
    },
    {
      scrollId: '2-time-threshold',
      label: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepLabel', { context: 'timeThreshold' }),
      title: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepTitle', { context: 'timeThreshold' }),
      content: <TimeThresholdSection />,
      valid: isTimeThresholdValid
    },
    {
      scrollId: '3-alert-channels',
      label: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepLabel', { context: 'alertChannels' }),
      title: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepTitle', { context: 'alertChannels' }),
      content: (
        <AlertChannelsSection
          setSliderState={setSliderState}
          setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
        />
      ),
      valid: areAlertChannelsValid
    },
    {
      scrollId: '4-alert-properties',
      label: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepLabel', { context: 'alertProperties' }),
      title: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepTitle', { context: 'alertProperties' }),
      content: <AlertPropertiesSection />,
      valid: isNameValid && isDescriptionValid
    },
    {
      scrollId: '5-custom-payload',
      label: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepLabel', { context: 'customPayload' }),
      title: t('in-alerting:smartAlerts.slo.advancedModeContainer.stepTitle', { context: 'customPayload' }),
      content: <CustomPayloadSection />,
      valid: isCustomPayloadFieldsValid
    }
  ];

  return <StepsContainer messages={messages} navItems={navItems} noDivider />;
}
