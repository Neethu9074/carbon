/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Message, Stack } from '@instana/components';

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import useAlertingGroupsByEvaluationType from 'in-alerting/smart-alerts/applications/tearSheet/hooks/useAlertingGroupsByEvaluationType';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import { getEntitySelectionAsTagFilterFormModel } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import GroupingTable from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupingTable';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3(props) {
  const { form, updateForm, isGlobalSmartAlert, isTagFilterFormModelValid } = props;

  const tagFilterExpression = form.get('tagFilterExpression').value;
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const evaluationType = form.get('evaluationType').value;
  const evaluationGroupByCount = form.get('hiddenFields').get('evaluationGroupByCount').value;
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;
  const granularity = form.get('granularity').value;

  const groupByTagFilterExpression = useMemo(() => {
    return getTagFilterExpression(applications, boundaryScope, tagFilterExpression);
  }, [applications, boundaryScope, tagFilterExpression]);

  const groupByPER_AP = useAlertingGroupsByEvaluationType(
    includeInternal,
    includeSynthetic,
    groupByTagFilterExpression,
    PER_AP,
    isTagFilterFormModelValid,
    applications,
    granularity
  );
  const groupByPER_AP_SERVICE = useAlertingGroupsByEvaluationType(
    includeInternal,
    includeSynthetic,
    groupByTagFilterExpression,
    PER_AP_SERVICE,
    isTagFilterFormModelValid,
    applications,
    granularity
  );
  const groupByPER_AP_ENDPOINT = useAlertingGroupsByEvaluationType(
    includeInternal,
    includeSynthetic,
    groupByTagFilterExpression,
    PER_AP_ENDPOINT,
    isTagFilterFormModelValid,
    applications,
    granularity
  );

  const isApplicationExists = Boolean(Object.keys(applications).length > 0);

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

  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });

  return (
    <TearSheetStepContentWrapper
      headline={t('in-alerting:smartAlerts.applications.tearSheet.grouping.title')}
      description={t('in-alerting:smartAlerts.applications.tearSheet.grouping.description')}
    >
      <Stack>
        <AlertEvaluationControl
          form={form}
          updateForm={updateForm}
          isGlobalSmartAlert={isGlobalSmartAlert}
          tearSheetView
        />
        <RenderGroupByContent
          isTagFilterFormModelValid={isTagFilterFormModelValid}
          evaluationGroupByCount={evaluationGroupByCount}
          evaluationType={evaluationType}
          tagFilterExpression={groupByTagFilterExpression}
          includeInternal={includeInternal}
          includeSynthetic={includeSynthetic}
          form={form}
          updateForm={updateForm}
          pagination={pagination}
          setPagination={setPagination}
          isApplicationExists={isApplicationExists}
          granularity={granularity}
        />
      </Stack>
    </TearSheetStepContentWrapper>
  );
}

export function RenderGroupByContent({
  isTagFilterFormModelValid,
  evaluationGroupByCount,
  evaluationType,
  tagFilterExpression,
  includeInternal,
  includeSynthetic,
  form,
  updateForm,
  pagination,
  setPagination,
  isApplicationExists,
  granularity
}) {
  if (!isTagFilterFormModelValid) {
    return (
      <div className={locals.borderBox}>
        <Message withIcon fullInlineWidth>
          {t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery')}
        </Message>
      </div>
    );
  }

  if (!isApplicationExists) {
    return (
      <div className={locals.borderBox}>
        <Message withIcon fullInlineWidth>
          {t('in-alerting:components.chart.alertingChartMessageEmptyApplicationSelection')}
        </Message>
      </div>
    );
  }

  if (evaluationGroupByCount?.[evaluationType]?.[0]?.message) {
    const errorMessage = evaluationGroupByCount[evaluationType]?.[0]?.message;
    return (
      <div className={locals.borderBox}>
        <Message withIcon fullInlineWidth>
          {t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupByDataFailed', {
            reason: errorMessage
          })}
        </Message>
      </div>
    );
  }

  return evaluationGroupByCount[evaluationType] === 0 ? (
    <div className={locals.borderBox}>
      <Message withIcon fullInlineWidth>
        {t('in-alerting:smartAlerts.applications.tearSheet.grouping.noData')}
      </Message>
    </div>
  ) : (
    <GroupingTable
      tagFilterExpression={tagFilterExpression}
      includeInternal={includeInternal}
      includeSynthetic={includeSynthetic}
      evaluationType={evaluationType}
      form={form}
      updateForm={updateForm}
      pagination={pagination}
      setPagination={setPagination}
      granularity={granularity}
    />
  );
}

export function getTagFilterExpression(applications, boundaryScope, tagFilterExpression) {
  const queryTagFilterExpression = toBackendQueryModel(
    joinExpressions({
      expressions: [tagFilterExpression, getEntitySelectionAsTagFilterFormModel(applications, boundaryScope)]
    })
  );

  return queryTagFilterExpression;
}
