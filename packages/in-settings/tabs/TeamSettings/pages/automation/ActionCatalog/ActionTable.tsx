/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';

import { Observable } from '@instana/observables';
import { Link } from '@instana/components';

import { teamSettingsActionCatalog, getEntityIdView } from 'in-settings/navigation/paths';
import List, { leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import Tag from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Tag';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { formatDateTime } from 'in-services/formatters/date';
import { getAllActions } from 'in-api/automation';
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

export interface ActionTableProps {
  title?: string;
  pageSize?: number;
  rightHeader?: ReactNode;
  loadEntities: () => Observable<Action[]>;
  tableActions?: TableActions<Action>;
  noDataMessage?: string;
  getEntityName?: (action: Action) => string;
}

export default function ActionTable({
  title,
  pageSize = 20,
  rightHeader,
  loadEntities = getAllActions,
  noDataMessage,
  tableActions = {},
  getEntityName
}: ActionTableProps) {
  return (
    <List<Action>
      title={title}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy={'name'}
      isSearchable
      loadEntities={loadEntities}
      columnDefinitions={columnDefinitions}
      getHeader={getHeader()}
      searchAttributes={['name', 'description', (entity: Action) => (entity?.tags ?? []).toString()]}
      searchPlaceholder={t('in-settings:tabs.filterActions')}
      searchMaxWidth={210}
      rightHeader={rightHeader}
      tableActions={tableActions}
      getEntityName={getEntityName}
    />
  );
}

function getHeader() {
  return leftHeaderWithSelectAll(t('in-settings:tabs.action_plural'), false, {});
}
