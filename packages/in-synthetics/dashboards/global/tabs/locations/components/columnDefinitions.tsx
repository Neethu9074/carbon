/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { LocationListItem, TimeConfig } from '@instana/types';
import { formatDateTime } from '@instana/format-date';
import { Link, SvgIcon } from '@instana/components';

// @ts-expect-error Could not find declaration type
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error Could not find declaration type
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import LocationListActionsColumn from 'in-synthetics/dashboards/global/tabs/locations/components/LocationListActionsColumn';
// eslint-disable-next-line no-restricted-imports
import { useNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import IPAddressPresenter from 'in-synthetics/dashboards/global/tabs/locations/components/IPAddressPresenter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter/HealthIndicatorPresenter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface LocationListProps extends ServerTablePresenterProps<LocationListItem> {
  timeConfig: TimeConfig;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

function LocationLabelContent({ item }: { item: LocationListItem }) {
  const entityHealthInfo = item.entityHealthInfo;
  const locationDescription = item.description ?? '';
  const href = useGetDashboardLink()(item.popSnapshotId ?? '', {
    pathname: physicalDashboardPath
  });

  return entityHealthInfo === undefined ? (
    <SeverityAwareEntityLink
      severity={item.entityHealthInfo?.maxSeverity}
      icon={'lib_synthetic_location'}
      label={item.label}
      tooltip={locationDescription}
    />
  ) : (
    <SeverityAwareEntityLink
      severity={item.entityHealthInfo?.maxSeverity}
      icon={'lib_synthetic_location'}
      label={item.label}
      tooltip={locationDescription}
      href={href}
    />
  );
}

let columnDefinitions: ColumnDefinition<LocationListItem, LocationListProps>[] = [
  {
    id: 'location_name',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-synthetics:dashboard.locationList.locationLabel'),
    getContent: item => <LocationLabelContent item={item} />
  },
  {
    id: 'location_label',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-synthetics:dashboard.locationList.locationDisplayLabel'),
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.displayLabel}</h4>
        </div>
      );
    }
  },
  {
    id: 'status',
    label: t('in-synthetics:dashboard.locationList.status'),
    sortable: true,
    defaultOrderDirection: 'DESC',
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.status}</h4>
        </div>
      );
    }
  },
  {
    id: 'type',
    label: t('in-synthetics:dashboard.locationList.type'),
    sortable: true,
    defaultOrderDirection: 'ASC',
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.type}</h4>
        </div>
      );
    }
  },
  {
    id: 'total_tests',
    label: t('in-synthetics:dashboard.locationList.totalTests'),
    sortable: true,
    defaultOrderDirection: 'DESC',
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.linkedTests}</h4>
        </div>
      );
    }
  },
  {
    id: 'last_test_run',
    label: t('in-synthetics:dashboard.locationList.lastRun'),
    sortable: true,
    defaultOrderDirection: 'DESC',
    getContent(item: LocationListItem) {
      if (item.lastRunOn > 0) {
        return (
          <div>
            <h4 className={locals.label}>{formatDateTime(item.lastRunOn)}</h4>
          </div>
        );
      } else {
        return (
          <div>
            <h4 className={locals.label} />
          </div>
        );
      }
    }
  },
  {
    id: 'namespace',
    label: t('in-synthetics:dashboard.locationList.namespace'),
    sortable: true,
    defaultOrderDirection: 'ASC',
    getContent(item: LocationListItem) {
      const namespaceId: string = item.namespaceId ?? '';
      const namespace: string = item.namespace ?? '';
      const popSnapshotId: string = item.popSnapshotId ?? '';
      if (namespace === '') {
        return (
          <HorizontalFlexWrapper>
            <div>
              <span className={locals.label}>{namespace}</span>
            </div>
          </HorizontalFlexWrapper>
        );
      } else {
        return namespaceId === '' || popSnapshotId.length > 0 ? (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_kubernetes_namespace'} />
            <div>
              <span className={locals.label}>{namespace}</span>
            </div>
          </HorizontalFlexWrapper>
        ) : (
          <HorizontalFlexWrapper>
            <SvgIcon type={'lib_kubernetes_namespace'} />
            <NamespaceLink namespaceId={namespaceId} namespace={namespace} />
          </HorizontalFlexWrapper>
        );
      }
    }
  },
  {
    id: 'ipAddresses',
    label: t('in-synthetics:dashboard.locationList.ipAddressColumn.ipAddress'),
    sortable: false,
    getContent(item: LocationListItem) {
      return <IPAddressPresenter item={item} />;
    }
  },
  {
    id: 'pop_version',
    label: t('in-synthetics:dashboard.locationList.popVersion'),
    sortable: true,
    defaultOrderDirection: 'DESC',
    getContent(item: LocationListItem) {
      return (
        <div>
          <h4 className={locals.label}>{item.popVersion}</h4>
        </div>
      );
    }
  },
  {
    id: 'health',
    label: t('in-synthetics:dashboard.locationList.health'),
    sortable: false,
    defaultOrderDirection: 'ASC',
    getContent(item: LocationListItem, { timeConfig }) {
      if (item.entityHealthInfo != undefined) {
        return (
          <EntityHealthIndicator
            openIssues={item.entityHealthInfo?.openIssues?.length ?? -1}
            maxSeverity={item.entityHealthInfo?.maxSeverity ?? -1}
            IndicatorPresenter={HealthIndicatorPresenter}
            timeConfig={timeConfig}
            snapshotId={item.popSnapshotId}
            inContentArea
          />
        );
      } else {
        return (
          <div>
            <span className={locals.label}>{t('in-synthetics:dashboard.locationList.noHealthInfo')}</span>
          </div>
        );
      }
    }
  }
];

if (role?.canConfigureSyntheticLocations) {
  columnDefinitions.push({
    id: 'action',
    label: t('in-synthetics:dashboard.testList.action'),
    sortable: false,
    getContent(item: LocationListItem, { result }) {
      return (
        <HorizontalFlexWrapper>
          <div>
            <LocationListActionsColumn item={item} isLoading={result?.progress?.loading ?? false} />
          </div>
        </HorizontalFlexWrapper>
      );
    }
  });
}

function NamespaceLink({ namespace, namespaceId }: { namespace: string; namespaceId: string }) {
  const href = useNamespaceDashboard(namespaceId);
  return (
    <Link href={href}>
      <span className={locals.label}>{namespace}</span>
    </Link>
  );
}

export default columnDefinitions;
