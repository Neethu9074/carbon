/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { Message } from '@instana/components';

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import useAlertingGroupsByEvaluationType from 'in-alerting/smart-alerts/applications/tearSheet/hooks/useAlertingGroupsByEvaluationType';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import GroupingTable from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupingTable';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3(props) {
  const { form, updateForm, isGlobalSmartAlert, isTagFilterFormModelValid } = props;

  const tagFilterExpression = form.get('tagFilterExpression').value;
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const evaluationType = form.get('evaluationType').value;
  const evaluationGroupByCount = form.get('hiddenFields').get('evaluationGroupByCount').value;

  const groupByPER_AP =
    useAlertingGroupsByEvaluationType(
      includeInternal,
      includeSynthetic,
      tagFilterExpression,
      PER_AP,
      isTagFilterFormModelValid
    ) ?? 0;
  const groupByPER_AP_SERVICE =
    useAlertingGroupsByEvaluationType(
      includeInternal,
      includeSynthetic,
      tagFilterExpression,
      PER_AP_SERVICE,
      isTagFilterFormModelValid
    ) ?? 0;
  const groupByPER_AP_ENDPOINT =
    useAlertingGroupsByEvaluationType(
      includeInternal,
      includeSynthetic,
      tagFilterExpression,
      PER_AP_ENDPOINT,
      isTagFilterFormModelValid
    ) ?? 0;

  useEffect(() => {
    updateForm(
      form.updateIn(['hiddenFields', 'evaluationGroupByCount'], f =>
        f
          .setValue({
            PER_AP: groupByPER_AP,
            PER_AP_SERVICE: groupByPER_AP_SERVICE,
            PER_AP_ENDPOINT: groupByPER_AP_ENDPOINT
          })
          .setTouched(true)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupByPER_AP, groupByPER_AP_SERVICE, groupByPER_AP_ENDPOINT]);

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
        {isTagFilterFormModelValid ? (
          evaluationGroupByCount[evaluationType] > 0 ? (
            <GroupingTable
              tagFilterExpression={tagFilterExpression}
              includeInternal={includeInternal}
              includeSynthetic={includeSynthetic}
              evaluationType={evaluationType}
              form={form}
              updateForm={updateForm}
            />
          ) : (
            <div className={locals.borderBox}>
              <Message withIcon>{t('in-alerting:smartAlerts.applications.tearSheet.grouping.noData')}</Message>
            </div>
          )
        ) : (
          <div className={locals.borderBox}>
            <Message withIcon>{t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery')}</Message>
          </div>
        )}
      </div>
    </TearSheetStepContentWrapper>
  );
}
