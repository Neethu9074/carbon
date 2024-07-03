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
import { useObservable } from '@instana/hooks';
import { Li, Ul } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import getBusinessProcesses from 'in-bizops/subscriptions/getBusinessProcesses';
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

  return (
    <>
      <Ul>
        <Li forceAlternateBg>
          <h2 className={local.headerText}>{t('in-bizops:perspectives.processesLiveList.title')}</h2>
        </Li>
      </Ul>
      <Ul>
        {tagFilterExpressionEmpty ? (
          <Li className={local.processesLiveListMessages}>{t('in-bizops:perspectives.processesLiveList.empty')}</Li>
        ) : !validTagFilterExpressionQuery ? (
          <Li className={local.processesLiveListMessages}>
            {t('in-bizops:perspectives.processesLiveList.invalidQuery')}
          </Li>
        ) : processesList?.progress?.loading ? (
          <Li>
            <LoadingIndicator text={t('in-bizops:perspectives.processesLiveList.loadingStateLabel')} />
          </Li>
        ) : processesList?.data?.items?.length == 0 ? (
          <Li className={local.processesLiveListMessages}>
            {t('in-bizops:perspectives.processesLiveList.noMatchedProcesses')}
          </Li>
        ) : (
          processesList?.data?.items?.map((item: BusinessProcessItem) => (
            <Li key={item.businessProcess.definitionId}>{item.businessProcess.definitionName}</Li>
          ))
        )}
      </Ul>
    </>
  );
}
