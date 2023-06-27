/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { Spacer } from '@instana/components';

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
import ActionInstanceDetail from 'in-automation/components/ActionHistory/actionInstanceDetail';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getActionInstances from 'in-automation/subscriptions/getActionInstances';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { OrderDirection, TimeConfig, ActionInstance } from 'in-types';
import Filters from 'in-automation/components/ActionHistory/Filters';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { getType } from 'in-automation/ActionCatalog/shared';
import { formatDateTime } from 'in-services/formatters/date';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './ActionHistoryTable.mless';

const columnDefinitions = [
  {
    label: t('in-automation:actionHistory.name'),
    id: 'actionName',
    getContent(row: ActionInstance) {
      return <div className={locals.fourLines}>{row.actionName}</div>;
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
      return formatDateTime(row.startDate);
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
      return <div className={locals.fourLines}>{row.problemText}</div>;
    }
  },
  {
    label: t('in-automation:actionHistory.status'),
    id: 'status',
    getContent(row: ActionInstance) {
      return getStatus(row.status);
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
  defaultOrderBy: 'actionName',
  defaultOrderDirection: 'ASC',
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
};

export function GetActionInstanceListData({
  timeConfig,
  orderBy = 'actionName',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = '',
  types = [],
  actionStatuses = []
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
    actionStatuses: actionStatuses
  });
}

export default function ActionHistoryTable() {
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
      actionStatuses={actionStatuses}
      onRowClick={(row: ActionInstance) => {
        addActiveDialog(<ActionInstanceDetail id={row.actionInstanceId} title={row.actionName} />);
      }}
      searchWidth={350}
      searchMaxWidth={450}
      searchPlaceholder={t('in-automation:actionHistory.filterNameOrActionInstanceId')}
    />
  );
}

export function getStatus(status: string) {
  if (status === 'SUCCESS' || status === 'FAILED') {
    return (
      <Tooltip content={status} themeStyle="light">
        <div
          className={classNames({
            [locals.statusIndicator]: true,
            [locals.statusIndicator__success]: status === 'SUCCESS',
            [locals.statusIndicator__fail]: status === 'FAILED'
          })}
        >
          {status === 'SUCCESS' ? t('in-automation:actionHistory.success') : t('in-automation:actionHistory.failed')}
        </div>
      </Tooltip>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <Tooltip themeStyle="light" content={status}>
        <HorizontalFlexWrapper>
          <LoadingIndicator width={0} size={'s'} />
          <Spacer horizontal="small" />
          {t('in-automation:actionHistory.inProgress')}
        </HorizontalFlexWrapper>
      </Tooltip>
    );
  }
  return <span>{t('in-automation:actionHistory.unknown')}</span>;
}
