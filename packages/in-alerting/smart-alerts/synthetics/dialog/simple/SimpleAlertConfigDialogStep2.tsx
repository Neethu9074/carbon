/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/synthetics/components/AlertTagFilterExpressionConfig';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep2.mless';

export interface SimpleAlertConfigDialogStep2Props {
  form: MapForm;
  updateForm?: (form: MapForm) => void;
  QueryBuilderComponent: QueryBuilderComponent;
  headerTransparent?: boolean;
}

export default function SimpleAlertConfigDialogStep2({
  form,
  updateForm,
  QueryBuilderComponent,
  headerTransparent = false
}: SimpleAlertConfigDialogStep2Props) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.synthetics.simple.scopeHeadline')}>
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertTagFilterExpressionConfig
          form={form}
          updateForm={updateForm}
          QueryBuilderComponent={QueryBuilderComponent}
          headerTransparent={headerTransparent}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
