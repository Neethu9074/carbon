/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/mobileApp/dialog/simple/SimpleAlertConfigDialogChart';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/eum/components/AlertTagFilterExpressionConfig';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import useMobileApp from 'in-mobile-apps/hooks/useMobileApp';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep2.mless';

export interface SimpleAlertConfigDialogStep2Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  QueryBuilderComponent: QueryBuilderComponent;
  label: string;
  onChartViewConfigChange: (arg: number) => void;
  selectedChartViewConfigIndex: number;
}

export default function SimpleAlertConfigDialogStep2({
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  QueryBuilderComponent,
  thresholdResult
}: AlertConfigDialogPresenterProps & MainDialogControl & SimpleAlertConfigDialogStep2Props) {
  const mobileAppId = form.get('mobileAppId')?.value;
  const [mobileApp] = useMobileApp(mobileAppId);
  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.mobileApp.simple.simpleAlertConfigDialogStep2Headline')}
    >
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertTagFilterExpressionConfig
          form={form}
          updateForm={updateForm}
          QueryBuilderComponent={QueryBuilderComponent}
          label={mobileApp?.label}
          iconType="lib_mobile_app"
        />
      </div>

      <div className={locals.stickyChart}>
        <SimpleAlertConfigDialogChart
          form={form}
          onChartViewConfigChange={onChartViewConfigChange}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          thresholdResult={thresholdResult}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
