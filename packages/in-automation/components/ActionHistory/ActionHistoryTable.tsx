/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { DateFormatterInput } from '@instana/format-date';

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
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Filters from 'in-automation/components/ActionHistory/Filters';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { formatDateTime } from 'in-services/formatters/date';
import { OrderDirection, TimeConfig } from 'in-types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './ActionHistoryTable.mless';

interface actionInstance {
  actionInstanceId: string;
  actionName: string;
  actionType: string;
  startDate: DateFormatterInput;
  endDate: DateFormatterInput;
  problemText: string;
  status: string;
}

const columnDefinitions = [
  {
    label: t('in-automation:actionHistory.name'),
    id: 'actionName',
    getContent(row: actionInstance) {
      return <div className={locals.fourLines}>{row.actionName}</div>;
    }
  },
  {
    label: t('in-automation:actionHistory.type'),
    id: 'type',
    getContent(row: actionInstance) {
      return <div className={locals.fourLines}>{row.actionType}</div>;
    }
  },
  {
    label: t('in-automation:actionHistory.startTime'),
    id: 'startDate',
    getContent(row: actionInstance) {
      return formatDateTime(row.startDate);
    }
  },
  {
    label: t('in-automation:actionHistory.endTime'),
    id: 'endDate',
    getContent(row: actionInstance) {
      return row.endDate ? formatDateTime(row.endDate) : formatDateTime(null);
    }
  },
  {
    label: t('in-automation:actionHistory.eventName'),
    id: 'problemText',
    getContent(row: actionInstance) {
      return <div className={locals.fourLines}>{row.problemText}</div>;
    }
  },
  {
    label: t('in-automation:actionHistory.status'),
    id: 'status',
    getContent(row: actionInstance) {
      return getStatus(row.status);
    }
  }
];

const urlStateDefinition = {
  bind: filterUrlStateDefinition.bind,
  reducer: (prevState: FilterState, { actionTypes, actionStatuses }: CurrentState) => ({
    actionTypes: actionTypes || prevState.actionTypes,
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
  actionTypes: string[];
  actionStatuses: string[];
};

export function GetActionInstanceListData({
  timeConfig,
  orderBy = 'actionName',
  orderDirection = 'ASC',
  page = 1,
  pageSize = 20,
  query = '',
  actionTypes = [],
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
    actionTypes: actionTypes,
    actionStatuses: actionStatuses
  });
}

export default function ActionHistoryTable() {
  const [{ actionTypes, actionStatuses }, setFilter] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  function useFilterHeader() {
    return <Filters setFilter={setFilter} actionTypes={actionTypes} actionStatuses={actionStatuses} />;
  }

  return (
    <ServerTableWithUrlState
      get={GetActionInstanceListData}
      timeConfig={timeConfig}
      rightHeader={useFilterHeader}
      title={t('in-automation:actionHistory.actionHistory')}
      showHeaderCount
      actionTypes={actionTypes}
      actionStatuses={actionStatuses}
      onRowClick={(row: any) => {
        addActiveDialog(<ActionInstanceDetail id={row.actionInstanceId} title={row.actionName} />);
      }}
    />
  );
}

export function getStatus(status: string) {
  if (status === 'SUCCESS' || status === 'FAILED') {
    return (
      <Tooltip content={status} themeStyle="light" align={'rightMiddle'}>
        <div
          className={classNames({
            [locals.statusIndicator]: true,
            [locals.statusIndicator__success]: status === 'SUCCESS',
            [locals.statusIndicator__fail]: status === 'FAILED'
          })}
        >
          {status}
        </div>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip themeStyle="light" content={status}>
        <div className={locals.wrapper}>
          <LoadingIndicator className={locals.inProgressLoading} size={'s'} />
          <div>In Progress</div>
        </div>
      </Tooltip>
    );
  }
}
