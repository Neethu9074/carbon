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
import {
  createTagFilterExpression,
  OPERATOR_OR,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useAlertingGroupsByEvaluationType from 'in-alerting/smart-alerts/applications/tearSheet/hooks/useAlertingGroupsByEvaluationType';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import { boundaryScopes } from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/config';
import GroupingTable from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupingTable';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { DESTINATION, NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { toTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3(props) {
  const { form, updateForm, isGlobalSmartAlert, isTagFilterFormModelValid } = props;

  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const evaluationType = form.get('evaluationType').value;
  const evaluationGroupByCount = form.get('hiddenFields').get('evaluationGroupByCount').value;
  const applications = form.get('applications').value;
  const boundaryScope = form.get('boundaryScope').value;

  const groupByTagFilterExpression = useMemo(() => {
    return getTagFilterExpression(applications, boundaryScope);
  }, [applications, boundaryScope]);

  const groupByPER_AP = useAlertingGroupsByEvaluationType(
    includeInternal,
    includeSynthetic,
    groupByTagFilterExpression,
    PER_AP,
    isTagFilterFormModelValid
  );
  const groupByPER_AP_SERVICE = useAlertingGroupsByEvaluationType(
    includeInternal,
    includeSynthetic,
    groupByTagFilterExpression,
    PER_AP_SERVICE,
    isTagFilterFormModelValid
  );
  const groupByPER_AP_ENDPOINT = useAlertingGroupsByEvaluationType(
    includeInternal,
    includeSynthetic,
    groupByTagFilterExpression,
    PER_AP_ENDPOINT,
    isTagFilterFormModelValid
  );

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
  setPagination
}) {
  if (!isTagFilterFormModelValid) {
    return (
      <div className={locals.borderBox}>
        <Message withIcon>{t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery')}</Message>
      </div>
    );
  }

  return evaluationGroupByCount[evaluationType] === 0 ? (
    <div className={locals.borderBox}>
      <Message withIcon>{t('in-alerting:smartAlerts.applications.tearSheet.grouping.noData')}</Message>
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
    />
  );
}

export function getTagFilterExpression(applications, boundaryScope) {
  if (!applications) {
    return toBackendQueryModel([]);
  }
  const applicationArray = applications && Object.values(applications);

  let allCallsScope = boundaryScope === boundaryScopes.all;

  const toTagFilterExpression = applicationArray.map(application =>
    toTagFilter({
      name: allCallsScope ? 'application.id' : 'boundary.application.id',
      operator: EQUALS,
      entity: allCallsScope ? DESTINATION : NOT_APPLICABLE,
      type: 'TAG_FILTER',
      value: application.applicationId
    })
  );

  return createTagFilterExpression(OPERATOR_OR, toTagFilterExpression);
}
