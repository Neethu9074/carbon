/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { Spacer, Typography } from '@instana/components';

import {
  CurrentState,
  FilterState,
  filterUrlStateDefinition,
  matrixPrefix,
  pathSegment,
  actionTypesUrlParameter,
  actionStatusesUrlParameter
} from 'in-automation/components/ActionHistory/constants';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import ActionInstanceDetail from 'in-automation/components/ActionHistory/ActionInstanceDetail';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getActionInstances from 'in-automation/subscriptions/getActionInstances';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { actionHistoryInstanceViewTracker } from 'in-automation/tracker';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { OrderDirection, TimeConfig, ActionInstance } from 'in-types';
import Filters from 'in-automation/components/ActionHistory/Filters';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import FourLineWrapper from '../FourLineWrapper/FourLineWrapper';
import { getType } from 'in-automation/ActionCatalog/shared';
import { formatDateTime } from 'in-services/formatters/date';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './ActionHistoryTable.mless';

const columnDefinitions = [
  {
    label: t('in-automation:actionHistory.name'),
    id: 'actionName',
    getContent(row: ActionInstance) {
      return (
        <FourLineWrapper>
          <Typography variant="body-regular">{row.actionName}</Typography>
        </FourLineWrapper>
      );
    }
  },
  {
    label: t('in-automation:actionHistory.type'),
    id: 'type',
    getContent(row: ActionInstance) {
      return getType(row.type);
    }
  },
  {
    label: t('in-automation:actionHistory.startTime'),
    id: 'startDate',
    getContent(row: ActionInstance) {
      return row.startDate ? formatDateTime(row.startDate) : formatDateTime(null);
    }
  },
  {
    label: t('in-automation:actionHistory.endTime'),
    id: 'endDate',
    getContent(row: ActionInstance) {
      return row.endDate ? formatDateTime(row.endDate) : formatDateTime(null);
    }
  },
  {
    label: t('in-automation:actionHistory.eventName'),
    id: 'problemText',
    getContent(row: ActionInstance) {
      return (
        <FourLineWrapper>
          <Typography variant="body-regular">{row.problemText}</Typography>
        </FourLineWrapper>
      );
    }
  },
  {
    label: t('in-automation:actionHistory.status'),
    id: 'status',
    getContent(row: ActionInstance) {
      return row.status ? getStatus(row.status) : t('in-automation:actionHistory.unknown');
    }
  }
];

const urlStateDefinition = {
  bind: filterUrlStateDefinition.bind,
  reducer: (prevState: FilterState, { types, actionStatuses }: CurrentState) => ({
    types: types || prevState.types,
    actionStatuses: actionStatuses || prevState.actionStatuses
  })
};

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions: columnDefinitions,
    title: t('in-automation:actionHistory.actionHistory'),
    description: t('in-automation:actionHistory.noActionInstances')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, actionTypesUrlParameter, actionStatusesUrlParameter],
  columnDefinitions: columnDefinitions,
  defaultOrderBy: 'startDate',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

type GetActionInstanceList = {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  types: string[];
  actionStatuses: string[];
  eventId?: string;
};

export function GetActionInstanceListData({
  timeConfig,
  orderBy = 'startDate',
  orderDirection = 'DESC',
  page = 1,
  pageSize = 20,
  query = '',
  types = [],
  actionStatuses = [],
  eventId
}: GetActionInstanceList) {
  return getActionInstances({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },

    search: query,
    timeConfig,
    types: types,
    actionStatuses: actionStatuses,
    eventId: eventId
  });
}

export default function ActionHistoryTable({ eventId }: { eventId?: string }) {
  const [{ types, actionStatuses }, setFilter] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  return (
    <ServerTableWithUrlState
      get={GetActionInstanceListData}
      timeConfig={timeConfig}
      rightHeader={<Filters setFilter={setFilter} types={types} actionStatuses={actionStatuses} />}
      title={t('in-automation:actionHistory.actionHistory')}
      showHeaderCount
      types={types}
      actionStatuses={
        actionStatuses.length === 0
          ? ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'STATUS_UNKNOWN', 'SUBMITTED', 'TIMEOUT']
          : actionStatuses
      }
      onRowClick={(row: ActionInstance) => {
        addActiveDialog(<ActionInstanceDetail id={row.actionInstanceId} title={row.actionName} />);
        actionHistoryInstanceViewTracker({
          actionInstanceId: row.actionInstanceId,
          actionName: row.actionName
        });
      }}
      searchWidth={350}
      searchMaxWidth={450}
      searchPlaceholder={t('in-automation:actionHistory.filterNameOrActionInstanceId')}
      eventId={eventId}
    />
  );
}

export function getStatus(status: string) {
  if (status === 'SUCCESS' || status === 'FAILED' || status === 'TIMEOUT') {
    return (
      <div
        className={classNames({
          [locals.statusIndicator]: true,
          [locals.statusIndicator__success]: status === 'SUCCESS',
          [locals.statusIndicator__fail]: status === 'FAILED' || status === 'TIMEOUT'
        })}
      >
        {status === 'SUCCESS'
          ? t('in-automation:actionHistory.success')
          : status === 'FAILED'
          ? t('in-automation:actionHistory.failed')
          : t('in-automation:actionHistory.timeout')}
      </div>
    );
  }
  if (status === 'SUBMITTED') {
    return (
      <div
        className={classNames({
          [locals.statusIndicator]: true,
          [locals.statusIndicator__submitted]: status === 'SUBMITTED'
        })}
      >
        <span>{t('in-automation:actionHistory.submitted')}</span>
      </div>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <HorizontalFlexWrapper>
        <LoadingIndicator width={0} size={'s'} />
        <Spacer horizontal="small" />
        {t('in-automation:actionHistory.inProgress')}
      </HorizontalFlexWrapper>
    );
  }
  return <span>{t('in-automation:actionHistory.unknown')}</span>;
}
