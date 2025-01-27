/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';

import ThresholdSelectionInteractiveSection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdSelectionInteractiveSection';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3({ form, updateForm, editMode, onChartViewConfigChange }) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.websites.tearSheet.threshold.header')}
          description={t('in-alerting:smartAlerts.websites.tearSheet.threshold.description')}
        >
          <Stack direction="vertical" gap="gutter" align="start">
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
          </Stack>
        </TearSheetStepTitleWrapper>
      </div>
    </>
  );
}
