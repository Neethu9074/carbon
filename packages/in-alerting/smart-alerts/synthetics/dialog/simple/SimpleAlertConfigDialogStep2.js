/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/synthetics/components/AlertTagFilterExpressionConfig';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogStep2.mless';

export default function SimpleAlertConfigDialogStep2({ form, updateForm, QueryBuilderComponent }) {
  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.synthetics.simple.scopeHeadline')}>
      <div className={locals.alertLocationFiltersWrapper}>
        <AlertTagFilterExpressionConfig
          form={form}
          updateForm={updateForm}
          QueryBuilderComponent={QueryBuilderComponent}
        />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
