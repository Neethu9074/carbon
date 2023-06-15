/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { reverse, sortBy } from 'lodash';
import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Observable } from '@instana/observables';
import { Button } from '@instana/components';
import { Link } from '@instana/components';

import { getType, isDocLink, isScript, isWebhook, getDocLinkFromFields } from 'in-automation/ActionCatalog/shared';
import List, { leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import CopyActionLink from 'in-automation/ActionCatalog/CopyActionLink';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import { getAllActions, ScoredAction } from 'in-automation/api';
import { getEntityIdView } from 'in-settings/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { runActionTracker } from 'in-automation/tracker';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Tag from 'in-automation/ActionCatalog/Tag';
import TestActionButton from './TestActionButton';
import { Event, VolatileId } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './ActionTable.mless';

const columnDefinitions = [
  {
    label: t('in-automation:ActionCatalog.description'),
    id: 'description',
    getContent(row: Action) {
      return <div className={locals.fourLines}>{row.description}</div>;
    }
  },
  {
    label: t('in-automation:ActionCatalog.type'),
    id: 'type',
    getContent(row: Action) {
      return getType(row.type);
    }
  },
  {
    label: t('in-automation:ActionCatalog.lastModified'),
    id: 'modifiedAt',
    getContent(row: Action) {
      return formatDateTime(+row.modifiedAt * 1000);
    }
  },
  {
    label: t('in-automation:ActionCatalog.tags'),
    id: 'tags',
    getContent(row: Action) {
      const { tags = [] } = row;
      return (
        <>
          {tags.map((tag, idx) => (
            <Tag key={tag + idx} tag={tag} />
          ))}
        </>
      );
    }
  }
];

const executeColumn = (volatileId: VolatileId, event?: Event) => ({
  id: 'execute',
  label: t('in-automation:ActionCatalog.execute'),
  getContent(row: Action) {
    const { type, fields } = row;
    if (isDocLink(type)) {
      const value = getDocLinkFromFields(fields).value;
      return (
        <Button
          kind="action"
          icon={'lib_views_external_link'}
          target="_blank"
          href={value}
          onClick={() => {
            runActionTracker({
              actionType: row.type,
              actionName: row.name
            });
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.launch')}
        </Button>
      );
    } else if (isScript(type) || isWebhook(type)) {
      return (
        <Button
          kind="action"
          icon={'lib_actions_play'}
          onClick={() => addActiveDialog(<RunActionDialog action={row} volatileId={volatileId} event={event} />)}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.run')}
        </Button>
      );
    } else {
      return <div>{t('in-automation:ActionCatalog.run')}</div>;
    }
  }
});

const testColumn = {
  id: 'test',
  label: '',
  widthInAbsoluteUnit: true,
  width: '4rem',
  getContent(row: Action) {
    return <TestActionButton action={row} />;
  }
};

const nameColumn = (showActionLink: boolean) => ({
  label: t('in-automation:ActionCatalog.name'),
  id: 'name',
  getContent(row: Action) {
    return (
      <Tooltip content={row.name} align="topLeft" delay={500}>
        {showActionLink ? (
          <Link className={locals.block} ellipsis href={getEntityIdView(actionCatalogPath, row.id)}>
            {row.name}
          </Link>
        ) : (
          <span className={classNames(locals.ellipsis, locals.block)}>{row.name}</span>
        )}
      </Tooltip>
    );
  }
});

const scoreColumn = {
  label: t('in-automation:ActionCatalog.confidenceTitle'),
  id: 'color',
  getContent(row: ScoredAction) {
    return t('in-automation:ActionCatalog.confidence', { context: row.color });
  },
  getValue(row: ScoredAction) {
    return row.score;
  }
};

const duplicateColumn = {
  id: 'duplicate',
  label: '',
  widthInAbsoluteUnit: true,
  width: '4rem',
  getContent(row: Action) {
    return <CopyActionLink action={row} />;
  }
};

export interface ActionTableProps {
  title?: string;
  pageSize?: number;
  rightHeader?: ReactNode;
  loadEntities: () => Observable<Action[]> | Observable<ScoredAction[]>;
  tableActions?: TableActions<Action>;
  noDataMessage?: string;
  hiddenIds?: string[];
  getEntityName?: (action: Action) => string;
  showExecuteColumn?: boolean | undefined;
  volatileId?: VolatileId;
  event?: Event;
  showActionLink?: boolean | undefined;
  scored?: boolean | undefined;
  showTestColumn?: boolean | undefined;
  showDuplicateColumn?: boolean | undefined;
  isBeta?: boolean;
  withBottomPadding?: boolean;
  isSearchable?: boolean;
}

export default function ActionTable({
  title = t('in-automation:ActionCatalog.actions'),
  pageSize = 20,
  rightHeader,
  loadEntities = getAllActions,
  noDataMessage,
  tableActions = {},
  hiddenIds = [],
  getEntityName,
  showExecuteColumn = false,
  volatileId = {},
  showActionLink = false,
  event,
  scored = false,
  showTestColumn = false,
  showDuplicateColumn = false,
  isBeta = false,
  isSearchable = true,
  withBottomPadding
}: ActionTableProps) {
  let columnDefinitionsToShow = [nameColumn(showActionLink), ...columnDefinitions];
  if (showExecuteColumn) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, executeColumn(volatileId, event)];
  }
  if (scored) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, scoreColumn];
  }

  if (showTestColumn) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, testColumn];
  }

  if (showDuplicateColumn) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, duplicateColumn];
  }

  return (
    <List<Action>
      withBottomPadding={withBottomPadding}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initalOrderDir={scored ? 'DESC' : 'ASC'}
      initialOrderBy={scored ? 'color' : 'name'}
      isSearchable={isSearchable}
      loadEntities={loadEntities}
      columnDefinitions={columnDefinitionsToShow}
      getHeader={getHeader(title, isBeta)}
      searchAttributes={['name', 'description', (entity: Action) => (entity?.tags ?? []).toString()]}
      searchPlaceholder={t('in-automation:ActionCatalog.searchActions')}
      searchMaxWidth={210}
      rightHeader={rightHeader}
      tableActions={tableActions}
      extraFilters={createFilters(hiddenIds)}
      getEntityName={getEntityName}
      customSortEntities={sortEntities}
    />
  );
}

function getHeader(title: string, isBeta: boolean) {
  return leftHeaderWithSelectAll(title, false, {}, isBeta);
}

function createFilters(ids: string[]): Array<(action: Action) => boolean> {
  const filterFunctions = [];
  if (ids) {
    filterFunctions.push((action: Action) => !ids.includes(action.id));
  }
  return filterFunctions;
}

function sortEntities({
  entities,
  orderByState,
  orderDirectionState
}: {
  entities: Action[];
  orderByState: keyof ScoredAction;
  orderDirectionState: 'ASC' | 'DESC';
}) {
  const caseInsensitiveSortIteratee = (entity: ScoredAction) => {
    let value = entity[orderByState];
    if (orderByState === 'color') {
      let sortValue;
      if (value == 'low') sortValue = 0;
      else if (value == 'medium') sortValue = 1;
      else if (value == 'high') sortValue = 2;
      return [sortValue, entity.name.trim().toLowerCase()];
    }
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  };

  const sorted = sortBy(entities, caseInsensitiveSortIteratee);
  if (orderDirectionState === 'DESC') {
    reverse(sorted);
  }
  return sorted as Action[];
}
