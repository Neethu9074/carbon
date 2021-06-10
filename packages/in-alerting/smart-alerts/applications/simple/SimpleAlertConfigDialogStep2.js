/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  isGlobalSmartAlert
}) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.applications.simple.simpleAlertStep2Headline')}>
      <div className={locals.alertLocationFiltersWrapper}>
        <ScopeConfig form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert} headerTransparent />
      </div>

      <div className={locals.stickyChart}>
        <SimpleAlertConfigDialogChart
          form={form}
          onChartViewConfigChange={onChartViewConfigChange}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
