/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer } from '@instana/components';

import ThresholdSelectionInteractiveSection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdSelectionInteractiveSection';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import EvaluationGranularity from 'in-alerting/smart-alerts/components/tearSheet/EvaluationGranularity';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3({ form, updateForm, editMode, onChartViewConfigChange }) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;

  const thresholdType = isWarningDefined
    ? warningThresholdField.get('type').value
    : criticalThresholdField.get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.websites.tearSheet.threshold.header')}
          description={t('in-alerting:smartAlerts.websites.tearSheet.threshold.description')}
        >
          {/* Threshold */}
          <ThresholdSelectionInteractiveSection
            form={form}
            eumType={websiteEum}
            alertType={alertType}
            updateForm={updateForm}
            editMode={editMode}
            onChartViewConfigChange={onChartViewConfigChange}
            blueprintConfig={blueprintConfig}
            isPercentageMetric={isPercentageMetric}
            getMetricUnitPostfix={getMetricUnitPostfix}
          />
          <Spacer size="small" />
          {/* Granularity Slider */}
          <EvaluationGranularity
            form={form}
            updateForm={updateForm}
            oneMinuteGranularityAllowed={
              thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
            }
            thresholdType={thresholdType}
          />
        </TearSheetStepTitleWrapper>
      </div>
    </>
  );
}
