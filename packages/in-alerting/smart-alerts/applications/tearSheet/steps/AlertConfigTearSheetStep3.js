/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import GroupingTable from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupingTable';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3(props) {
  const { form, updateForm, isGlobalSmartAlert } = props;

  const tagFilterExpression = form.get('tagFilterExpression').value;
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const evaluationType = form.get('evaluationType').value;

  return (
    <TearSheetStepContentWrapper
      headline={t('in-alerting:smartAlerts.applications.tearSheet.grouping.title')}
      description={t('in-alerting:smartAlerts.applications.tearSheet.grouping.description')}
    >
      <div className={locals.container}>
        <AlertEvaluationControl
          form={form}
          updateForm={updateForm}
          isGlobalSmartAlert={isGlobalSmartAlert}
          tearSheetView
        />
        <span className={locals.seperator} />
        <GroupingTable
          tagFilterExpression={tagFilterExpression}
          includeInternal={includeInternal}
          includeSynthetic={includeSynthetic}
          evaluationType={evaluationType}
        />
      </div>
    </TearSheetStepContentWrapper>
  );
}
