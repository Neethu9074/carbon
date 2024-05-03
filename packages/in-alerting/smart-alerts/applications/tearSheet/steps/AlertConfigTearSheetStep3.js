/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import TearSheetAlertEvaluationControl from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/TearSheetAlertEvaluationControl';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3(props) {
  const { form, updateForm, isGlobalSmartAlert } = props;
  return (
    <TearSheetStepContentWrapper
      headline={t('in-alerting:smartAlerts.applications.tearSheet.grouping.title')}
      description={t('in-alerting:smartAlerts.applications.tearSheet.grouping.description')}
    >
      <div className={locals.container}>
        <TearSheetAlertEvaluationControl form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert} />
      </div>
    </TearSheetStepContentWrapper>
  );
}
