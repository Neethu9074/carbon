/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleAlertConfigDialogStep3';
import SimpleAlertConfigDialogStep1 from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep1';
import SimpleAlertConfigDialogStep2 from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogStep2';
import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { websitesAlertingStepSwitch } from 'in-alerting/smart-alerts/websites/tracker';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/simple/SimpleModeContainer.mless';

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

export default function SimpleModeContainer({
  editMode,
  form,
  onChange,
  onClose,
  setSliderState,
  websiteLabel,
  onCreate,
  setSimpleModeStep,
  updateForm,
  isSaving,
  QueryBuilderComponent,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  isTagFilterFormModelValid
}) {
  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        editMode={editMode}
        onClose={onClose}
        onCreate={onCreate}
        isSaving={isSaving}
        setSimpleModeStep={setSimpleModeStep}
        updateForm={updateForm}
        stepConfigs={stepConfigs}
        onStepChanged={(oldStep, nextStep) => websitesAlertingStepSwitch({ oldStep, nextStep })}
        renderStep={step => {
          switch (step) {
            case 0:
              return (
                <SimpleAlertConfigDialogStep1
                  form={form}
                  updateForm={updateForm}
                  onChange={onChange}
                  setJsErrorsListVisible={setSliderState}
                  onChartViewConfigChange={onChartViewConfigChange}
                  selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                />
              );
            case 1:
              return (
                <SimpleAlertConfigDialogStep2
                  form={form}
                  QueryBuilderComponent={QueryBuilderComponent}
                  updateForm={updateForm}
                  websiteLabel={websiteLabel}
                  onChartViewConfigChange={onChartViewConfigChange}
                  selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                />
              );
            case 2:
              return (
                <SimpleAlertConfigDialogStep3
                  form={form}
                  onChange={onChange}
                  setAlertChannelsVisible={setSliderState}
                />
              );
          }
        }}
        additionalStepCheck={step => {
          return step !== 1 ? isTagFilterFormModelValid : true;
        }}
      />
    </div>
  );
}
