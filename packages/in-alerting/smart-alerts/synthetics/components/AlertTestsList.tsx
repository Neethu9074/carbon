/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import List, { leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import { Result, SyntheticTest } from 'in-types';
import { getTests } from 'in-synthetics/api';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AlertTestsList.mless';

export interface AlertTestsListProps {
  setTitle: boolean;
  tableActions: TableActions<SyntheticTest>;
  loadEntities?: () => Observable<SyntheticTest[]>;
  noDataMessage?: string;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  hiddenIds?: string[];
  pageSize?: number;
  rightHeader: ReactNode;
  isSearchable?: boolean;
  onRowClick?: (entity: any) => void;
  inSelectListDialog?: boolean;
  getHeader?: (
    totalHitsBeforeFilter: number,
    totalHitsAfterFilter: number,
    entitiesBeforePagination: number
  ) => ReactNode;
}

export default function AlertTestsList({
  setTitle = true,
  tableActions = {},
  loadEntities,
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  inSelectListDialog = false
}: AlertTestsListProps): JSX.Element {
  const syntheticTests = useObservable(() => getTests(), []);

  return (
    <List<SyntheticTest>
      title={setTitle ? t('in-alerting:smartAlerts.synthetics.selectTests.alertTests') : null}
      getHeader={defaultGetHeader(inSelectListDialog, tableActions)}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions()}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : () => just((syntheticTests as Result<SyntheticTest[]>)?.data ?? [])}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="label"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['label']}
      extraFilters={createFilters(hiddenIds ?? [])}
      searchPlaceholder={t('in-settings:tabs.filter')}
      onRowClick={onRowClick}
    />
  );
}

function columnDefinitions() {
  return [
    {
      id: 'test_name',
      label: t('in-synthetics:dashboard.testList.testLabel'),
      width: 50,
      getContent(entity: SyntheticTest) {
        return (
          <Tooltip content={entity.label} align="topLeft" delay={500}>
            <span className={locals.label}>{entity.label}</span>
          </Tooltip>
        );
      },
      getValue(entity: SyntheticTest) {
        return entity.label;
      }
    },
    {
      id: 'status',
      label: t('in-synthetics:dashboard.testList.status'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticTest) {
        const status = entity?.active
          ? t('in-synthetics:dashboard.testList.active')
          : t('in-synthetics:dashboard.testList.paused');
        return <span className={locals.label}>{status}</span>;
      }
    },
    {
      id: 'synthetic_type',
      label: t('in-synthetics:dashboard.testList.type'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticTest) {
        return (
          <div>
            <div className={locals.label}>{entity?.configuration?.syntheticType}</div>
            <span className={locals.secText}>
              {t('in-synthetics:dashboard.testList.frequencySubText', {
                count: entity?.testFrequency
              })}
            </span>
          </div>
        );
      }
    }
  ];
}

function defaultGetHeader(inSelectListDialog: boolean, tableActions: TableActions<SyntheticTest>) {
  return leftHeaderWithSelectAll(
    t('in-alerting:smartAlerts.synthetics.selectTests.alertTests'),
    inSelectListDialog,
    tableActions
  );
}

function getEntityName(entity: SyntheticTest): string {
  return t('in-alerting:smartAlerts.synthetics.selectTests.alertTestEntityName', { entityName: entity.label });
}

export function noRightHeader() {
  // Used to explicitly disable that default right header (create new Synthetic test button) when this is used in a
  // dialog to select synthetic test in the alert details form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits on that
  // form.
  return null;
}

function createFilters(
  hiddenIds: string[]
): Array<(element: SyntheticTest, index: number, array: SyntheticTest[]) => boolean> {
  if (hiddenIds) {
    return [
      (entity: SyntheticTest) => {
        return entity?.id ? hiddenIds.indexOf(entity?.id) < 0 : false;
      }
    ];
  }
  return [];
}
