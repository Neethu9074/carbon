/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SimpleAlertConfigDialogStep3 from 'in-new-components/Alerting/simple/SimpleAlertConfigDialogStep3';
import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SimpleAlertConfigDialogStep2 from 'in-applications/alerting/simple/SimpleAlertConfigDialogStep2';
import SimpleAlertConfigDialogStep1 from 'in-applications/alerting/simple/SimpleAlertConfigDialogStep1';
import { applicationsAlertingStepSwitch } from 'in-applications/alerting/tracker';
import { t } from 'in-i18n';

import locals from './SimpleModeContainer.mless';

const stepConfigs = [
  {
    title: t('in-applications:simple.step1Title'),
    validateIntermediately: [
      ['rule', 'message'],
      ['rule', 'level']
    ]
  },
  {
    title: t('in-applications:simple.step2Title'),
    validateIntermediately: [['applications']]
  },
  {
    title: t('in-applications:simple.step3Title'),
    validateIntermediately: [['alertChannelIds']]
  }
];

export default function SimpleModeContainer({
  form,
  onChange,
  onClose,
  setSliderState,
  timeConfig,
  applicationLabel,
  onCreate,
  setSimpleModeStep,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  QueryBuilderComponent,
  isTagFilterFormModelValid
}) {
  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        onClose={onClose}
        onCreate={onCreate}
        setSimpleModeStep={setSimpleModeStep}
        updateForm={updateForm}
        stepConfigs={stepConfigs}
        onStepChanged={(oldStep, nextStep) => applicationsAlertingStepSwitch({ oldStep, nextStep })}
        renderStep={step => {
          switch (step) {
            case 0:
              return (
                <SimpleAlertConfigDialogStep1
                  form={form}
                  updateForm={updateForm}
                  setLogMessagesListVisible={setSliderState}
                  onChartViewConfigChange={onChartViewConfigChange}
                  selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                />
              );
            case 1:
              return (
                <SimpleAlertConfigDialogStep2
                  form={form}
                  timeConfig={timeConfig}
                  updateForm={updateForm}
                  applicationLabel={applicationLabel}
                  onChartViewConfigChange={onChartViewConfigChange}
                  selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                  QueryBuilderComponent={QueryBuilderComponent}
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
