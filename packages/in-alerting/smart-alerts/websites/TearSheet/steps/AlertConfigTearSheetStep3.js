/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';

import SlownessThresholdCondition from 'in-alerting/smart-alerts/websites/TearSheet/ThresholdConditions/SlownessThresholdCondition';
// import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { t } from 'in-i18n';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3({ form, updateForm, editMode }) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  // console.log('alertType ', alertType);

  return (
    <>
      <div className={locals.container60_40}>
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.websites.tearSheet.threshold.header')}
          description={t('in-alerting:smartAlerts.websites.tearSheet.threshold.description')}
        >
          <Stack direction="vertical" gap="gutter" align="start">
            <AlertTypeSwitch
              alertType={alertType}
              renderSlowness={() => (
                <SlownessThresholdCondition
                  form={form}
                  blueprintConfig={blueprintConfig}
                  updateForm={updateForm}
                  editMode={editMode}
                />
              )}
            />
          </Stack>
        </TearSheetStepTitleWrapper>
      </div>
    </>
  );
}
