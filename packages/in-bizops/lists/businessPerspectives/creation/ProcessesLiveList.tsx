/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  BusinessDataQuery,
  BusinessProcessItem,
  Order,
  Pagination,
  Result,
  TagCatalog,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';
import { ContainedList, ContainedListItem } from '@instana/carbon';
import { NoDataEmptyState } from '@instana/ibm-products';
import { Card, Pill } from '@instana/components';
import { useObservable } from '@instana/hooks';

//import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import getBusinessProcesses from 'in-bizops/subscriptions/getBusinessProcesses';
// @ts-expect-error Module needs to be translated to TS
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import local from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface ProcessesLiveListProps {
  tagFilterExpressionFormModel: FormModelElement[];
  blueprintCatalogResult: Result<TagCatalog>;
  timeConfig: TimeConfig;
}

export default function ProcessesLiveList({
  tagFilterExpressionFormModel,
  blueprintCatalogResult,
  timeConfig
}: ProcessesLiveListProps) {
  const tagFilterExpressionEmpty = tagFilterExpressionFormModel.length == 0;
  const validTagFilterExpressionQuery =
    !tagFilterExpressionEmpty &&
    validateFormModel({ tagCatalog: blueprintCatalogResult?.data, formModel: tagFilterExpressionFormModel }).isValid;

  const pagination: Pagination = {
    page: 1,
    pageSize: 5
  };
  const order: Order = {
    by: 'process_name',
    direction: 'ASC'
  };

  let tagFilterExpression: TagFilterExpressionElementUnion = toBackendQueryModel([]);
  if (validTagFilterExpressionQuery) {
    tagFilterExpression = toBackendQueryModel(tagFilterExpressionFormModel);
  }

  const businessDataQuery: BusinessDataQuery = {
    dataType: 'PROCESS',
    metrics: {},
    pagination: pagination,
    tagFilterExpression: tagFilterExpression,
    timeConfig: timeConfig,
    order: order
  };
  const processesList =
    useObservable(getBusinessProcesses(businessDataQuery), [tagFilterExpressionFormModel]) ?? pendingResult;

  const processCount =
    tagFilterExpressionEmpty || !validTagFilterExpressionQuery ? 0 : processesList?.data?.items?.length;

  const listHeader = (
    <div className={local.listHeader}>
      <div className={local.listHeadline}>{t('in-bizops:perspectives.processesLiveList.title')}</div>
      <Pill type="cool-gray">{processCount}</Pill>
    </div>
  );

  return (
    <Card className={local.influencerCard}>
      <div className="bizops-processes-live-list">
        <ContainedList label={listHeader} kind="on-page">
          {processesList?.progress?.loading ? (
            <LoadingIndicator />
          ) : processesList?.data?.items?.length == 0 ? (
            <NoDataEmptyState
              className={local.emptyState}
              title={t('in-bizops:perspectives.processesLiveList.noMatchedProcesses')}
              subtitle={t('in-bizops:perspectives.processesLiveList.empty')}
            />
          ) : tagFilterExpressionEmpty ? (
            <NoDataEmptyState
              className={local.emptyState}
              title={t('in-bizops:perspectives.processesLiveList.noMatchedProcesses')}
              subtitle={t('in-bizops:perspectives.processesLiveList.empty')}
            />
          ) : !validTagFilterExpressionQuery ? (
            <NoDataEmptyState
              className={local.emptyState}
              title={t('in-bizops:perspectives.processesLiveList.noMatchedProcesses')}
              subtitle={t('in-bizops:perspectives.processesLiveList.invalidQuery')}
            />
          ) : (
            processesList?.data?.items?.map((item: BusinessProcessItem) => (
              <ContainedListItem key={item.businessProcess.definitionId}>
                {item.businessProcess.definitionName}
              </ContainedListItem>
            ))
          )}
        </ContainedList>
      </div>
    </Card>
  );
}
