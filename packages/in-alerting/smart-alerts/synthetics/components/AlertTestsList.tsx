/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useState } from 'react';

import { Result, SyntheticTest } from '@instana/types';
import { Observable } from '@instana/observables';
import { Link } from '@instana/components';

import AssociationsContentPresenter from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContentPresenter';
import ApplicationLabelContent from 'in-synthetics/dashboards/global/tabs/tests/components/ApplicationLabelContent';
import List, { ColumnDefinition, leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import { syntheticsSummaryPath, syntheticsDashboard } from 'in-synthetics/navigation/paths';
import ListDataTable from 'in-alerting/smart-alerts/components/ListTable/ListTable';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { getDisplayType } from 'in-synthetics/utils/syntheticTypeMap';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { pageSizes } from 'in-alerting/smart-alerts/data/constants';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { TrProps } from 'in-components/tables/ServerTable/types';
import { defaultRunType } from 'in-synthetics/utils/constants';
import { getTestsAsResultObservable } from 'in-synthetics/api';
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
  displayApplicationLabel?: boolean;
  hasRowNavigation?: boolean;
  noDataHeader?: string;
  noDataDescription?: string;
  isTearSheet?: boolean;
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
  inSelectListDialog = false,
  displayApplicationLabel = true,
  hasRowNavigation = false,
  noDataHeader,
  noDataDescription,
  isTearSheet = false
}: AlertTestsListProps): JSX.Element {
  const [count, setCount] = useState<string | undefined>(undefined);
  const syntheticTests = getTestsAsResultObservable(defaultRunType)
    .map((result: Result<SyntheticTest[]> | null) => {
      if (result == null || result?.progress?.loading) {
        return null;
      }

      return (result as Result<SyntheticTest[]>)?.data ?? [];
    })
    .startWith(null);

  const Title = ({ count }: { count: string | undefined }) => {
    return (
      <AlertTypography
        variant="heading-200"
        noMargin
        content={
          count
            ? `${t('in-alerting:smartAlerts.synthetics.selectTests.alertTests')} ${count}`
            : t('in-alerting:smartAlerts.synthetics.selectTests.alertTests')
        }
      />
    );
  };

  return (
    <>
      {isTearSheet ? (
        <ListDataTable<SyntheticTest>
          title={<Title count={count} />}
          columnDefinitions={
            displayApplicationLabel
              ? [...columnDefinitions(hasRowNavigation), applicationLabel()]
              : columnDefinitions(hasRowNavigation)
          }
          tableActions={tableActions}
          loadEntities={loadEntities ? loadEntities : () => syntheticTests}
          listPageSize={pageSize}
          pageSizes={pageSizes}
          rightHeader={rightHeader}
          isSearchable={isSearchable}
          searchPlaceholder={t('in-settings:tabs.filter')}
          noDataHeader={noDataHeader}
          noDataDescription={noDataDescription}
          initialOrderBy={'label'}
          setCount={setCount}
        />
      ) : (
        <List<SyntheticTest>
          title={setTitle ? t('in-alerting:smartAlerts.synthetics.selectTests.alertTests') : null}
          getHeader={setTitle ? defaultGetHeader(inSelectListDialog, tableActions) : () => null}
          getEntityName={getEntityName}
          columnDefinitions={
            displayApplicationLabel
              ? [...columnDefinitions(hasRowNavigation), applicationLabel()]
              : columnDefinitions(hasRowNavigation)
          }
          tableActions={tableActions}
          //@ts-expect-error
          loadEntities={loadEntities ? loadEntities : () => syntheticTests}
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
          getRowProps={getRowProps}
        />
      )}
    </>
  );
}

function TestLabelContent({ item }: { item: SyntheticTest }) {
  const { location, createHref } = useNavigation();
  location.pathname = syntheticsSummaryPath;
  const locationDisplayLabels = item?.locationDisplayLabels ? item?.locationDisplayLabels.join(',') : '';
  let locationIds = item?.locations ? item?.locations.join(',') : '';

  setOrDeleteMatrixKey(location, syntheticsDashboard, 'testId', item?.id);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'testLabel', item?.label);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'type', item?.configuration?.syntheticType);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'locationDisplayLabels', locationDisplayLabels);
  setOrDeleteMatrixKey(location, syntheticsDashboard, 'locationIds', locationIds);

  // Add runType parameter to prevent datascope label error
  if (defaultRunType) {
    setOrDeleteMatrixKey(location, syntheticsDashboard, 'runType', defaultRunType);
  }

  return <Link href={createHref(location)}>{item?.label}</Link>;
}

function columnDefinitions(hasRowNavigation: boolean): Array<ColumnDefinition<SyntheticTest>> {
  return [
    {
      id: 'test_name',
      label: t('in-synthetics:dashboard.testList.testLabel'),
      ellipsis: '25vw',
      getContent(entity: SyntheticTest) {
        return (
          <Tooltip content={entity.label} delay={500} align="auto" forceTheme>
            {hasRowNavigation ? (
              <TestLabelContent item={entity} />
            ) : (
              <span className={locals.label}>{entity.label}</span>
            )}
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
      width: '10%',
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
      width: '10%',
      getContent(entity: SyntheticTest) {
        return (
          <div>
            <div className={locals.label}>{getDisplayType(entity?.configuration?.syntheticType)}</div>
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

function applicationLabel(): ColumnDefinition<SyntheticTest> {
  return {
    id: syntheticRbacLimitedEnabled ? 'associationLabels' : 'applicationLabel',
    label: t('in-synthetics:dashboard.testList.associationLabel'),
    width: '20%',
    defaultOrderDirection: 'ASC',
    getContent(item: SyntheticTest) {
      if (syntheticRbacLimitedEnabled) {
        const applicationLabels = item.applicationLabels ?? [];
        const applicationIds = item.applications ?? [];
        const websiteLabels = item.websiteLabels ?? [];
        const websiteIds = item.websites ?? [];
        const mobileAppLabels = item.mobileAppLabels ?? [];
        const mobileAppIds = item.mobileApps ?? [];

        return (
          <AssociationsContentPresenter
            applicationIds={applicationIds}
            applicationLabels={applicationLabels}
            websiteIds={websiteIds}
            websiteLabels={websiteLabels}
            mobileAppIds={mobileAppIds}
            mobileAppLabels={mobileAppLabels}
            applicationIdsCanBeLinked={[]}
            websiteIdsCanBeLinked={[]}
            mobileAppIdsCanBeLinked={[]}
          />
        );
      }

      const applicationLabel = item.applicationLabel ?? '';
      const applicationId = item.applicationId ?? '';

      return (
        <ApplicationLabelContent
          applicationId={applicationId}
          applicationLabel={applicationLabel}
          shouldDisplayLink={false}
        />
      );
    }
  };
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

function getRowProps(): TrProps {
  return {
    className: locals.row,
    size: 'compact'
  };
}
