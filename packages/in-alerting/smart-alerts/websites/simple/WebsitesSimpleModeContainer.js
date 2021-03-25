/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep2';
import { websitesAlertingStepSwitch } from 'in-alerting/smart-alerts/websites/tracker';
import { t } from 'in-i18n';

const stepConfigs = [
  {
    title: t('in-alerting:smartAlerts.websites.simple.stepConfigsStep1Title'),
    validateIntermediately: [['rule', 'value']]
  },
  {
    title: t('in-alerting:smartAlerts.websites.simple.stepConfigsStep2Title')
  },
  {
    title: t('in-alerting:smartAlerts.websites.simple.stepConfigsStep3Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

const onStepChanged = (oldStep, nextStep) => websitesAlertingStepSwitch({ oldStep, nextStep });

export default function WebsitesSimpleModeContainer({
  onChange,
  setSliderState,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  QueryBuilderComponent,
  websiteLabel,
  ...props
}) {
  const stepRenderers = [
    parentProps => (
      <SimpleAlertConfigDialogStep1
        onChange={onChange}
        setJsErrorsListVisible={setSliderState}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        {...parentProps}
      />
    ),
    parentProps => (
      <SimpleAlertConfigDialogStep2
        QueryBuilderComponent={QueryBuilderComponent}
        websiteLabel={websiteLabel}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        {...parentProps}
      />
    ),
    parentProps => (
      <SimpleAlertConfigDialogStep3 onChange={onChange} setAlertChannelsVisible={setSliderState} {...parentProps} />
    )
  ];

  return (
    <SimpleModeContainer
      stepConfigs={stepConfigs}
      onStepChanged={onStepChanged}
      stepRenderers={stepRenderers}
      {...props}
    />
  );
}

WebsitesSimpleModeContainer.propTypes = {
  form: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  setSimpleModeStep: PropTypes.func.isRequired,
  setSliderState: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  isTagFilterFormModelValid: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  QueryBuilderComponent: PropTypes.elementType.isRequired,
  websiteLabel: PropTypes.string.isRequired
};
