/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';
import { reverse, sortBy } from 'lodash';
import classNames from 'classnames';

import { Button, Link } from '@instana/components';
import { Observable } from '@instana/observables';

import { teamSettingsActionCatalog, getEntityIdView } from 'in-settings/navigation/paths';
import List, { leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import Tag from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Tag';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import RunAction from 'in-events/components/AutomationActions/RunAction';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getAllActions, ScoredAction } from 'in-api/automation';
import { formatDateTime } from 'in-services/formatters/date';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Event, VolatileId } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

import locals from './ActionTable.mless';

const columnDefinitions = [
  {
    label: t('in-settings:tabs.description'),
    id: 'description',
    getContent(row: Action) {
      return <div className={locals.fourLines}>{row.description}</div>;
    }
  },
  {
    label: t('in-settings:tabs.type'),
    id: 'type',
    getContent: getType
  },
  {
    label: t('in-settings:tabs.lastModified'),
    id: 'modifiedAt',
    getContent(row: Action) {
      return formatDateTime(+row.modifiedAt * 1000);
    }
  },
  {
    label: t('in-settings:tabs.tags'),
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

const executeColumn = (volatileId: VolatileId, event: Event | null) => ({
  id: 'execute',
  label: t('in-settings:tabs.execute'),
  getContent(row: Action) {
    const { type, fields } = row;
    if (type === 'doc_link') {
      const field = fields?.[0];
      const value = field?.value;
      return (
        <Button kind="action" icon={'lib_views_external_link'} target="_blank" href={value} noAutoMargin>
          {t('in-settings:tabs.launch')}
        </Button>
      );
    } else if (type === 'SCRIPT') {
      const field = fields?.[1];
      const value = field?.value ?? '';
      return (
        <Button
          kind="action"
          icon={'lib_actions_play'}
          onClick={() =>
            addActiveDialog(<RunAction action={row} script={value} volatileId={volatileId} event={event} />)
          }
          noAutoMargin
        >
          {t('in-settings:tabs.run')}
        </Button>
      );
    } else {
      return <div>{t('in-settings:tabs.run')}</div>;
    }
  }
});

const nameColumn = (showActionLink: boolean) => ({
  label: t('in-settings:tabs.name'),
  id: 'name',
  getContent(row: Action) {
    return (
      <Tooltip content={row.name} align="topLeft" delay={500}>
        {showActionLink ? (
          <Link className={locals.block} ellipsis href$={getEntityIdView(teamSettingsActionCatalog, row.id)}>
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
  label: t('in-settings:tabs.confidenceTitle'),
  id: 'color',
  getContent(row: ScoredAction) {
    return t('in-settings:tabs.confidence', { context: row.color });
  },
  getValue(row: ScoredAction) {
    return row.score;
  }
};

export interface ActionTableProps {
  title?: string;
  pageSize?: number;
  rightHeader?: ReactNode;
  loadEntities: () => Observable<Action[]>;
  tableActions?: TableActions<Action>;
  noDataMessage?: string;
  hiddenIds?: string[];
  getEntityName?: (action: Action) => string;
  showExecuteColumn?: boolean | undefined;
  volatileId?: VolatileId;
  event?: Event | null;
  showActionLink?: boolean | undefined;
  scored?: boolean | undefined;
}

export default function ActionTable({
  title = t('in-settings:tabs.actions'),
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
  event = null,
  scored = false
}: ActionTableProps) {
  let columnDefinitionsToShow = [nameColumn(showActionLink), ...columnDefinitions];
  if (showExecuteColumn) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, executeColumn(volatileId, event)];
  }
  if (scored) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, scoreColumn];
  }

  return (
    <List<Action>
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initalOrderDir={scored ? 'DESC' : 'ASC'}
      initialOrderBy={scored ? 'color' : 'name'}
      isSearchable
      loadEntities={loadEntities}
      columnDefinitions={columnDefinitionsToShow}
      getHeader={getHeader(title)}
      searchAttributes={['name', 'description', (entity: Action) => (entity?.tags ?? []).toString()]}
      searchPlaceholder={t('in-settings:tabs.filterActions')}
      searchMaxWidth={210}
      rightHeader={rightHeader}
      tableActions={tableActions}
      extraFilters={createFilters(hiddenIds)}
      getEntityName={getEntityName}
      customSortEntities={sortEntities}
    />
  );
}

function getHeader(title: string) {
  return leftHeaderWithSelectAll(title, false, {});
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
