/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Link } from '@instana/components';

import { teamSettingsActionCatalog, getEntityIdView, teamSettingsActionDetailsNew } from 'in-settings/navigation/paths';
import List, { leftHeaderWithSelectAll, createNewEntityButton } from 'in-settings/components/List';
import Tag from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Tag';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { getAllActions, deleteAction } from 'in-api/automation';
import { formatDateTime } from 'in-services/formatters/date';
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
      const { tags } = row;
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
const tableActions = {
  delete: {
    deleteEntity: (action: Action) => deleteAction(action.id)
  }
};
export default function ActionCatalog({ setTitle = true, pageSize = 20 }) {
  return (
    <List
      title={setTitle ? t('in-settings:tabs.actionCatalog') : null}
      noDataMessage={t('in-settings:tabs.noActions')}
      pageSize={pageSize}
      initialOrderBy="name"
      isSearchable
      tableActions={tableActions}
      loadEntities={getAllActions}
      getEntityName={(action: Action) => t('in-settings:tabs.actionWithNameForDelete', { actionName: action.name })}
      columnDefinitions={columnDefinitions}
      getHeader={getHeader()}
      searchAttributes={['name', 'description', 'tags']}
      searchPlaceholder={t('in-settings:tabs.filterActions')}
      searchMaxWidth={210}
      rightHeader={defaultRightHeader()}
    />
  );
}
function getHeader() {
  return leftHeaderWithSelectAll(t('in-settings:tabs.action_plural'), false, {});
}

function defaultRightHeader() {
  return createNewEntityButton({
    labelNew: t('in-settings:tabs.newAction'),
    pathNew: teamSettingsActionDetailsNew
  });
}
