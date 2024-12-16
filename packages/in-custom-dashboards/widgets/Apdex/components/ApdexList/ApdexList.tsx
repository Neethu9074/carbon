/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ApdexConfiguration, PaginatedResult, Result } from '@instana/types';
import { IconButton, Button } from '@instana/components';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { addActiveDialog, close as closeDialog } from 'in-components/DialogPresenter/store';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { FetchedState } from 'in-hooks/utils/types';
import { t, Trans } from 'in-i18n';

import locals from './ApdexList.mless';

interface ApdexListItem {
  onEdit: (item: ApdexConfiguration) => void;
  onDelete: (id: string) => void;
}

interface ServerTableApdexConfiguration extends ApdexListItem, ServerTablePresenterProps<ApdexConfiguration> {}

interface ApdexListProps extends ApdexListItem, Partial<Omit<ServerTableApdexConfiguration, 'onDelete' | 'onEdit'>> {
  fetchedConfigState: FetchedState<ApdexConfiguration[]>;
  onSelect: (item: ApdexConfiguration) => void;
  onCreate: () => void;
}

export default function ApdexList({
  fetchedConfigState,
  onSelect,
  onDelete,
  onEdit,
  onChange,
  onCreate,
  query,
  orderBy = 'name',
  orderDirection = 'ASC'
}: ApdexListProps) {
  const paginatedResult = fetchedStateToPaginatedResult(fetchedConfigState);
  const { page = 0, pageSize = 0 } = paginatedResult?.data || {};

  return (
    <ServerTablePresenter<ApdexConfiguration, ServerTableApdexConfiguration>
      result={paginatedResult}
      getRowProps={() => ({
        size: 'compact'
      })}
      page={page}
      pageSize={pageSize}
      query={query}
      orderBy={orderBy}
      orderDirection={orderDirection}
      cardTitle={t('in-custom-dashboards:widgets.apdex.apdexList.cardTitle')}
      onRowClick={onSelect}
      onDelete={onDelete}
      onEdit={onEdit}
      onChange={onChange}
      numSkeletonRows={3}
      columnDefinitions={columnDefinitions}
      rightHeader={
        <Button
          kind="action"
          onClick={onCreate}
          icon="lib_openclose_add_circle_outline"
          className={locals.createButton}
        >
          {t('in-custom-dashboards:widgets.apdex.apdexList.createButton')}
        </Button>
      }
      isSearchable
    />
  );
}

const columnDefinitions: ColumnDefinition<ApdexConfiguration, ServerTableApdexConfiguration>[] = [
  {
    id: 'name',
    sortable: true,
    label: t('in-custom-dashboards:widgets.apdex.apdexList.nameColumn'),
    getContent(item) {
      return item.apdexName;
    }
  },
  {
    id: 'threshold',
    sortable: false,
    label: t('in-custom-dashboards:widgets.apdex.apdexList.thresholdColumn'),
    getContent(item) {
      return millis.compact(item.apdexEntity.threshold);
    }
  },
  {
    id: 'edit',
    label: '',
    sortable: false,
    width: '1',
    getContent(item, { onEdit }) {
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-custom-dashboards:widgets.apdex.apdexList.editApdexTooltip')}>
            <IconButton
              kind="primary"
              type="lib_actions_edit"
              className={locals.iconButton}
              onClick={() => onEdit(item)}
            />
          </Tooltip>
        </div>
      );
    }
  },
  {
    id: 'delete',
    label: '',
    sortable: false,
    width: '1',
    getContent(item, { onDelete }) {
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-custom-dashboards:widgets.apdex.apdexList.deleteApdexTooltip')}>
            <IconButton
              kind="primary"
              type="lib_actions_delete"
              className={locals.iconButton}
              onClick={() => {
                addActiveDialog(
                  <ConfirmationDialog
                    header={t('in-custom-dashboards:widgets.apdex.apdexList.confirmDeleteHeader')}
                    description={
                      <span>
                        <Trans
                          i18nKey="in-custom-dashboards:widgets.apdex.apdexList.confirmDeleteMessage"
                          values={{ apdex: item.apdexName }}
                          components={{ italic: <i />, bold: <strong /> }}
                        />
                      </span>
                    }
                    confirmButtonLabel={t('in-custom-dashboards:widgets.apdex.apdexList.confirmDeleteButton')}
                    onSubmit={() => {
                      closeDialog();
                      onDelete(item.id);
                    }}
                  />
                );
              }}
            />
          </Tooltip>
        </div>
      );
    }
  }
];

function fetchedStateToPaginatedResult([apdexConfigs, , errors, progress]: FetchedState<ApdexConfiguration[]>): Result<
  PaginatedResult<ApdexConfiguration>
> {
  if (!apdexConfigs) return { errors, progress, data: undefined };

  const data = {
    items: apdexConfigs,
    page: 1,
    pageSize: apdexConfigs.length,
    totalHits: apdexConfigs.length
  };

  return { errors, progress, data };
}
