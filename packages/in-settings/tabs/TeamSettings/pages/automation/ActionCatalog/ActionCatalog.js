/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { teamSettingsActionCatalog, getEntityIdView } from 'in-settings/navigation/paths';
import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { getAllActions } from 'in-api/automation';
import { t } from 'in-i18n';

// import locals from './Events.mless';

const columnDefinitions = [
  {
    label: t('in-automation:action:name'),
    id: 'name',
    getContent(row) {
      return <Link href$={getEntityIdView(teamSettingsActionCatalog, row.id)}>{row.name}</Link>;
    }
  },
  {
    label: t('in-automation:action:description'),
    id: 'description',
    getContent(row) {
      return row.description;
    }
  },
  {
    label: t('in-automation:action:type'),
    id: 'type',
    getContent(row) {
      return row.type;
    }
  },
  {
    label: t('in-automation:action:invocations'),
    id: 'invocations',
    getContent(row) {
      return row?.stats?.runs?.total.toString() ?? '0';
    }
  },
  {
    label: t('in-automation:action:successRate'),
    id: 'successRate',
    getContent(row) {
      return row?.stats?.runspercent?.toString() ?? null;
    }
  },
  {
    label: t('in-automation:action:lastModified'),
    id: 'lastModified',
    getContent(row) {
      return new Date(row._modifiedAt).toLocaleString();
    }
  },
  {
    label: t('in-automation:action:tags'),
    id: 'tags',
    getContent() {
      return '';
    }
  }
];
export default function ActionCatalog({ setTitle = true, noDataMessage, pageSize = 20 }) {
  return (
    <List
      title={setTitle ? t('in-settings:tabs.actionCatalog') : null}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="name"
      isSearchable
      loadEntities={getAllActions}
      columnDefinitions={columnDefinitions}
      getHeader={getHeader()}
      searchAttributes={['name', 'description']}
      searchPlaceholder={t('in-settings:tabs.filterActions')}
      searchMaxWidth={210}
    />
  );
}
function getHeader() {
  return leftHeaderWithSelectAll(t('in-settings:tabs.actions'), false, {});
}
