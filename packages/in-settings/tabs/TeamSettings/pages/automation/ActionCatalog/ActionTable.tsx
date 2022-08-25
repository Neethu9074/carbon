/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get, reverse, sortBy } from 'lodash';
import React, { ReactNode } from 'react';

import { Button, Link } from '@instana/components';
import { Observable } from '@instana/observables';

import { teamSettingsActionCatalog, getEntityIdView } from 'in-settings/navigation/paths';
import List, { leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import Tag from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Tag';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import RunAction from 'in-events/components/AutomationActions/RunAction';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { formatDateTime } from 'in-services/formatters/date';
import { getAllActions } from 'in-api/automation';
import { Event, VolatileId } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    label: t('in-settings:tabs.name'),
    id: 'name',
    getContent(row: Action) {
      return <Link href$={getEntityIdView(teamSettingsActionCatalog, row.id)}>{row.name}</Link>;
    }
  },
  {
    label: t('in-settings:tabs.description'),
    id: 'description',
    getContent(row: Action) {
      return row.description;
    }
  },
  {
    label: t('in-settings:tabs.type'),
    id: 'type',
    getContent: getType
  },
  {
    label: t('in-settings:tabs.invocations'),
    id: 'invocations',
    getContent() {
      return '0';
    }
  },
  {
    label: t('in-settings:tabs.successRate'),
    id: 'successRate',
    getContent() {
      return null;
    }
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

const scoreColumn = {
  label: 'AI Score',
  id: 'score',
  getContent(row: Action) {
    return row.score?.toFixed(2);
  },
  getValue(row: Action) {
    return row.score;
  }
};

const executeColumn = (volatileId: VolatileId, event: Event | null) => ({
  id: 'execute',
  label: 'Execute',
  getContent(row: Action) {
    const { type, fields } = row;
    if (type === 'doc_link') {
      const field = fields?.[0];
      const value = field?.value;
      return (
        <Button kind="action" icon={'lib_views_external_link'} target="_blank" href={value} noAutoMargin>
          Launch
        </Button>
      );
    } else if (type === 'SCRIPT') {
      const field = fields?.[1];
      const value = field?.value ?? '';
      return (
        <Button
          kind="action"
          icon={'lib_actions_play'}
          // onClick={() =>runScriptAction(value, volatileId).once(console.log)}
          onClick={() => addActiveDialog(<RunAction script={value} volatileId={volatileId} event={event} />)}
          noAutoMargin
        >
          Run
        </Button>
      );
    } else {
      return <div>Run</div>;
    }
  }
});

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
  scored?: boolean;
  event?: Event | null;
}

export default function ActionTable({
  title,
  pageSize = 20,
  rightHeader,
  loadEntities = getAllActions,
  noDataMessage,
  tableActions = {},
  hiddenIds = [],
  getEntityName,
  showExecuteColumn = false,
  volatileId = {},
  scored = false,
  event = null
}: ActionTableProps) {
  let columnDefinitionsToShow = columnDefinitions;
  if (showExecuteColumn) {
    columnDefinitionsToShow = [...columnDefinitions, executeColumn(volatileId, event)];
  }
  if (scored) {
    columnDefinitionsToShow = [...columnDefinitionsToShow, scoreColumn];
  }

  return (
    <List<Action>
      title={title}
      initalOrderDir={scored ? 'DESC' : 'ASC'}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy={scored ? 'score' : 'name'}
      isSearchable
      loadEntities={loadEntities}
      columnDefinitions={columnDefinitionsToShow}
      getHeader={getHeader()}
      searchAttributes={['name', 'description', (entity: Action) => (get(entity, 'tags') ?? []).toString()]}
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

function getHeader() {
  return leftHeaderWithSelectAll(t('in-settings:tabs.action_plural'), false, {});
}

function createFilters(ids: string[]): Array<(action: Action) => boolean> {
  const filterFunctions = [];
  if (ids) {
    filterFunctions.push((action: Action) => ids.indexOf(action.id) < 0);
  }
  return filterFunctions;
}

function sortEntities({
  entities,
  orderByState,
  orderDirectionState
}: {
  entities: Action[];
  orderByState: keyof Action;
  orderDirectionState: 'ASC' | 'DESC';
}): Action[] {
  const caseInsensitiveSortIteratee = (entity: Action) => {
    let value = entity[orderByState as keyof Action];
    if (orderByState === 'score') {
      return [value, entity.name.trim().toLowerCase()];
    }
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  };

  const sorted = sortBy(entities, caseInsensitiveSortIteratee);
  if (orderDirectionState === 'DESC') {
    reverse(sorted);
  }
  return sorted;
}
