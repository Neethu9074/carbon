/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { InfrastructureExploreItem, PaginatedResult, Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

//@ts-expect-error TS migration
import { infraExplorePath, useLinkToCustomEntityDashboards } from 'in-infrastructure/navigation/paths';
//@ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default function InstanceList() {
  const { location } = useNavigation();
  const timeConfig = useTimeConfig();
  const customEntityModel = getMatrixParameter(location, infraExplorePath, 'customEntityModel') ?? '';
  const entityInstances = useGetEntityInstances(timeConfig, customEntityModel);

  const columnDefinitions = [
    {
      id: 'label',
      width: '12rem',
      label: t('in-infrastructure:explore.name'),
      sortable: true,
      getContent: (item: InfrastructureExploreItem) => <EntityLinkWithSnapshot item={item} />
    },
    {
      id: 'health',
      width: '5rem',
      widthInAbsoluteUnit: true,
      label: t('in-infrastructure:explore.health'),
      sortable: false,
      getContent: (item: InfrastructureExploreItem) => (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo?.openIssues?.length ?? 0}
          maxSeverity={item.entityHealthInfo?.maxSeverity ?? 0}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.snapshotId}
          inContentArea
        />
      )
    }
  ];

  const items = entityInstances?.data?.items ?? [];
  const isLoading = entityInstances.progress.loading;

  return (
    <ServerTablePresenter<InfrastructureExploreItem, ServerTablePresenterProps<InfrastructureExploreItem>>
      columnDefinitions={columnDefinitions}
      cardTitle={customEntityModel}
      searchPlaceholder={'search'}
      withoutSearchIcon
      page={0}
      pageSize={0}
      orderBy={''}
      orderDirection={'ASC'}
      result={{
        progress: {
          loading: isLoading
        },
        errors: [],
        data: {
          items,
          page: 0,
          pageSize: 0,
          totalHits: 0
        }
      }}
    />
  );
}

function useGetEntityInstances(timeConfig: TimeConfig, customEntityModel: string) {
  return (
    useObservable(() => {
      return getEntities({
        filter: {
          tagFilterExpression: {
            type: 'TAG_FILTER',
            name: 'customentity.model.name',
            operator: 'EQUALS',
            entity: 'NOT_APPLICABLE',
            value: customEntityModel
          },
          timeConfig
        },
        pagination: {
          retrievalSize: 20
        },
        order: {
          by: 'label',
          direction: 'ASC'
        },
        type: 'customEntity'
      });
    }, [timeConfig, customEntityModel]) ?? (pendingResult as Result<PaginatedResult<InfrastructureExploreItem>>)
  );
}

function useSnapshotData(item: InfrastructureExploreItem) {
  return useObservable(
    () =>
      item.snapshotId
        ? getSnapshot(item.snapshotId, getTimeConfigAtMoment(item.time)).map(snapshot => snapshot.toJS())
        : just({}),
    [item.snapshotId, item.time]
  );
}

function EntityLinkWithSnapshot({ item }: Readonly<{ item: InfrastructureExploreItem }>) {
  const getDashboardLink = useLinkToCustomEntityDashboards();
  const snapshot = useSnapshotData(item);
  const customEntityModelId = snapshot?.data?.model?.id;

  return (
    <div>
      <EntityLink label={item.label ?? ''} href={getDashboardLink(customEntityModelId, item.snapshotId ?? '')} />
    </div>
  );
}
