/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { OrderDirection, TimeConfig, ActionInstance } from '@instana/types';
import { Spacer, Typography, IconButton } from '@instana/components';
import { create } from '@instana/observables';

import {
  CurrentState,
  FilterState,
  filterUrlStateDefinition,
  matrixPrefix,
  pathSegment,
  actionTypesUrlParameter,
  actionStatusesUrlParameter,
  getActorType
} from 'in-automation/components/ActionHistory/constants';
// @ts-expect-error
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import ActionInstanceDetail from 'in-automation/components/ActionHistory/ActionInstanceDetail';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getActionInstances from 'in-automation/subscriptions/getActionInstances';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import Filters from 'in-automation/components/ActionHistory/Filters';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import WithSubscript from 'in-settings/components/WithSubscript';
import { ACTION_TRANSLATIONS } from 'in-automation/constants';
import { formatDateTime } from 'in-services/formatters/date';
import { deleteActionInstance } from 'in-automation/api';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './ActionHistoryTable.mless';

function showConfirmationDialog(
  actionInstance: ActionInstance,
  actionHistoryInstanceDeleteTrackerSegment: TrackingFunction
) {
  const { actionInstanceId = '', createdDate } = actionInstance;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-automation:deleteDialog.pleaseConfirm')}
      description={
        <Typography variant="body-regular">
          <Trans i18nKey="in-automation:deleteDialog.pleaseConfirmMsg" values={{ name: actionInstanceId }} />
        </Typography>
      }
      confirmButtonLabel={t('in-automation:deleteDialog.delete')}
      onSubmit={() => {
        close();
        onDelete(actionInstance, createdDate, actionHistoryInstanceDeleteTrackerSegment);
      }}
    />
  );
}

function onDelete(
  actionInstance: ActionInstance,
  createdDate: number,
  actionHistoryInstanceDeleteTrackerSegment: TrackingFunction
) {
  const { actionInstanceId = '' } = actionInstance;
  deleteActionInstance(actionInstanceId, createdDate).once(
    res => {
      if (res.deletedDocumentsCount && Number(res.deletedDocumentsCount) > 0) {
        onDeleteSuccess();
        refresh();
        actionHistoryInstanceDeleteTrackerSegment({
          actionName: actionInstance.actionName,
          actionType: actionInstance.type,
          metadata: actionInstance.metadata,
          actionInstanceId
        });
      } else {
        onDeleteFailed();
      }
    },
    () => {
      onDeleteFailed();
    }
  );
}

function onDeleteSuccess() {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-automation:actionHistory.deleteDialog.success')
    },
    'action-instance-delete-info'
  );
}

function onDeleteFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-automation:actionHistory.deleteDialog.failure')
    },
    'action-instance-delete-error'
  );
}

const urlStateDefinition = {
  bind: filterUrlStateDefinition.bind,
  reducer: (prevState: FilterState, { types, actionStatuses }: CurrentState) => ({
    types: types || prevState.types,
    actionStatuses: actionStatuses || prevState.actionStatuses
  })
};

const refreshSignal = create().emit(true);
function refresh() {
  refreshSignal.emit(true);
}

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
  return refreshSignal.flatMap(() =>
    getActionInstances({
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
    })
  );
}

interface ActionHistoryTableProps {
  eventId?: string;
  customActionTypes?: string[];
  noFilters?: boolean;
  noEvent?: boolean;
  title?: string;
}

export default function ActionHistoryTable({
  eventId,
  customActionTypes,
  noFilters = false,
  noEvent = false,
  title
}: ActionHistoryTableProps) {
  const { actionHistoryInstanceViewTrackerSegment, actionHistoryInstanceDeleteTrackerSegment } = useSegmentTracker();

  let columnDefinitions: ColumnDefinition<ActionInstance>[] = [
    {
      label: t('in-automation:actionHistory.name'),
      id: 'actionName',
      width: 20,
      getContent(row: ActionInstance) {
        return (
          <Tooltip content={row.actionName} align="auto" delay={500} overwriteBlock>
            <WithSubscript subscript={ACTION_TRANSLATIONS[row.type]}>
              <div
                className={classNames({
                  [locals.smallColumn]: row.actionName.length > 60,
                  [locals.ellipsis]: true
                })}
              >
                <Typography variant="body-regular">{row.actionName}</Typography>
              </div>
            </WithSubscript>
          </Tooltip>
        );
      }
    },
    {
      label: t('in-automation:actionHistory.initiator'),
      id: 'actorName',
      width: 15,
      getContent(row: ActionInstance) {
        return (
          <Tooltip content={row.actorName} align="auto" delay={500} overwriteBlock>
            <WithSubscript subscript={getActorType(row.actorType ?? 'ACTOR_UNKNOWN')}>
              <div
                className={classNames({
                  [locals.smallColumn]: row.actorName && row.actorName.length > 60,
                  [locals.ellipsis]: true
                })}
              >
                <Typography variant="body-regular">{row.actorName}</Typography>
              </div>
            </WithSubscript>
          </Tooltip>
        );
      }
    },
    {
      label: t('in-automation:actionHistory.startTime'),
      id: 'startDate',
      width: 15,
      getContent(row: ActionInstance) {
        return row.startDate ? formatDateTime(row.startDate) : formatDateTime(null);
      }
    },
    {
      label: t('in-automation:actionHistory.endTime'),
      id: 'endDate',
      width: 15,
      getContent(row: ActionInstance) {
        return row.endDate ? formatDateTime(row.endDate) : formatDateTime(null);
      }
    },
    {
      label: t('in-automation:actionHistory.eventName'),
      id: 'problemText',
      width: 25,
      getContent(row: ActionInstance) {
        return (
          <Tooltip content={row.problemText} align="auto" delay={500}>
            <div
              className={classNames({
                [locals.smallColumn]: row?.problemText && row?.problemText.length > 60
              })}
            >
              <Typography variant="body-regular">{row.problemText}</Typography>
            </div>
          </Tooltip>
        );
      }
    },
    {
      label: t('in-automation:actionHistory.status'),
      id: 'status',
      sortable: true,
      width: 10,
      getContent(row: ActionInstance) {
        return row.status ? getStatus(row.status) : t('in-automation:actionHistory.unknown');
      }
    }
  ];

  const deleteColumn: ColumnDefinition<ActionInstance> = {
    label: '',
    id: 'delete',
    sortable: false,
    width: 5,
    getContent(row) {
      if (!isStatusFinished(row.status)) return null;
      return (
        <Tooltip content={t('in-automation:actionHistory.deleteTooltip')} delay={500}>
          <IconButton
            kind="action"
            type="lib_actions_delete"
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              showConfirmationDialog(row, actionHistoryInstanceDeleteTrackerSegment);
            }}
          />
        </Tooltip>
      );
    }
  };

  if (role?.canDeleteAutomationActionHistory) {
    columnDefinitions.push(deleteColumn);
  }

  if (noEvent) {
    columnDefinitions = columnDefinitions.filter(col => {
      return col.id !== 'problemText';
    });
  }

  const [{ types, actionStatuses }, setFilter] = useUrlState(urlStateDefinition);
  const timeConfig = useTimeConfig();

  const ServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions: columnDefinitions,
      title: title ?? t('in-automation:actionHistory.actionHistory'),
      description: t('in-automation:actionHistory.noActionInstances')
    }),
    paginationResettingUrlParameters: [...timeConfigUrlParameters, actionTypesUrlParameter, actionStatusesUrlParameter],
    columnDefinitions: columnDefinitions,
    defaultOrderBy: 'startDate',
    defaultOrderDirection: 'DESC',
    pathSegment,
    matrixPrefix
  });

  return (
    <ServerTableWithUrlState
      get={GetActionInstanceListData}
      timeConfig={timeConfig}
      actionHistoryInstanceDeleteTrackerSegment={actionHistoryInstanceDeleteTrackerSegment}
      rightHeader={!noFilters ? <Filters setFilter={setFilter} types={types} actionStatuses={actionStatuses} /> : <></>}
      title={title ?? t('in-automation:actionHistory.actionHistory')}
      showHeaderCount
      types={customActionTypes || types}
      actionStatuses={
        actionStatuses.length === 0
          ? ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'STATUS_UNKNOWN', 'SUBMITTED', 'TIMEOUT']
          : actionStatuses
      }
      onRowClick={(row: ActionInstance) => {
        addActiveDialog(<ActionInstanceDetail id={row.actionInstanceId} title={row.actionName} />);
        actionHistoryInstanceViewTrackerSegment({
          actionInstanceId: row.actionInstanceId,
          actionName: row.actionName
        });
      }}
      searchWidth={350}
      searchMaxWidth={450}
      searchPlaceholder={t('in-automation:actionHistory.filter')}
      eventId={eventId}
    />
  );
}

function isStatusFinished(status?: string) {
  return status === 'SUCCESS' || status === 'FAILED' || status === 'TIMEOUT';
}

export function getStatus(status: string) {
  if (isStatusFinished(status)) {
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
