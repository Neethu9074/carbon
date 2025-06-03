/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { filter } from 'lodash';
import React from 'react';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { pageSizes } from 'in-alerting/smart-alerts/data/constants';
import { getApplicationConfigs } from 'in-api/applicationConfigs';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { t } from 'in-i18n';

import locals from './Applications.mless';

export default function Applications({
  setTitle = true,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = false,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  return (
    <List
      title={setTitle ? t('in-settings:tabs.applicationPerspectives') : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getApplicationConfigs}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="label"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['label']}
      extraFilters={createFilters(hiddenIds)}
      searchPlaceholder={t('in-settings:tabs.filter')}
      onRowClick={onRowClick}
      getDetailsHref={null}
      pageSizes={pageSizes}
    />
  );
}

function columnDefinitions() {
  return [
    {
      id: 'label',
      label: t('in-settings:tabs.name'),
      width: 100,
      ellipsis: true,
      getContent(entity) {
        return <span className={locals.ellipsis}>{entity.label}</span>;
      },
      getValue(entity) {
        return entity.id;
      }
    }
  ];
}

const defaultTableActions = {};

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll(t('in-settings:tabs.applicationPerspectives'), inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return t('in-settings:tabs.applicationPerspectiveEntityLabel', { entityLabel: entity.label });
}

export function noRightHeader() {
  // Used to explicitly disable that default right header when this is used in a
  // dialog to select applications in the access permission set form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits.
  return null;
}

function createFilters(hiddenIds) {
  const filters = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }
  return filters;
}

export const getSelectedApplicationsForAlert = createMemoizedObservableForReferencedEntities(function (
  selectedApplicationIds
) {
  if (selectedApplicationIds.length === 0) {
    return alwaysEmptyArray;
  }
  return getApplicationConfigs().map(application =>
    filter(application, function (app) {
      return selectedApplicationIds.indexOf(app.id) >= 0;
    })
  );
});

export function getSelectedApplicationConfigsByName(selectedApplicationName) {
  return getApplicationConfigs()
    .map(application =>
      filter(application, function (app) {
        return selectedApplicationName === app.label;
      })
    )
    .startWith(null);
}

export function applicationSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          setForm(
            form.updateIn(['applicationIds'], field => {
              return field
                .setValue(field.value.filter(referencedId => referencedId !== deselectedEntity.id))
                .setTouched(true);
            })
          );
        }
      }
    }
  };
}

export function submitApplicationSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['applicationIds'], field => {
      return field.setValue(field.value.concat(selectedIds)).setTouched(true);
    })
  );
}

export function getSelectedApplicationsForAlertsEvents(selectedApplicationIds, applicationConfigs) {
  if (selectedApplicationIds.length === 0) {
    return alwaysEmptyArray;
  }
  return applicationConfigs.map(application =>
    filter(application, function (app) {
      return selectedApplicationIds.indexOf(app.id) >= 0;
    })
  );
}
