/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect } from 'react';

import { InfrastructureExploreItem } from '@instana/types';
import { Typography } from '@instana/components';
import { Button, Stack } from '@instana/carbon';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import CollectorDashboardLink from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboardLink';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { datasourceOtemCollectorCatalog, datasourcesPath } from 'in-plg/navigation/paths';
import NoDataEmptyState from 'in-plg/components/NoDataEmptyState/NoDataEmptyState';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { useCollectors } from 'in-applications/hooks/useCollectors';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { t } from 'in-i18n';

import locals from 'in-plg/pages/Datasource/OTelCollector/OTelCollector.mless';

const LOAD_CHUNK_SIZE = 10;
const matrixPrefix = '';
const pathSegment = datasourcesPath;

const OTelCollector = () => {
  const { createHrefToPath, goToPath } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [retrievalSize, setRetrievalSize] = useState(LOAD_CHUNK_SIZE);
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'id',
    defaultPageSize: 10
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const collectorsResult = useCollectors({
    retrievalSize,
    query
  });
  const collectors = collectorsResult?.data?.items as unknown as InfrastructureExploreItem[];
  const totalHits = collectorsResult?.data?.totalHits ?? 0;
  useEffect(() => {
    if (collectorsResult !== undefined) {
      setLoading(false);
    }
  }, [collectorsResult]);

  if (collectorsResult === undefined) {
    return null;
  }

  const columnDefinitions = [
    {
      id: 'collectorId',
      label: t('in-plg:datasources.collectorId'),
      getContent: (row: InfrastructureExploreItem) => <CollectorDashboardLink {...row} />
    },
    {
      id: 'health',
      label: t('in-plg:datasources.health'),
      getContent: (row: InfrastructureExploreItem) => <HealthStatus entityHealthInfo={row.entityHealthInfo} />
    }
  ];

  const canLoadMore = collectors?.length < totalHits;

  if (!collectorsResult?.progress?.loading && !collectorsResult?.data?.items?.length && !query)
    return (
      <NoDataEmptyState
        title={t('in-plg:datasources.noData.oTelCollector.emptyState_title')}
        subtitle={t('in-plg:datasources.noData.oTelCollector.emptyState_subtitle')}
        illustrationPosition="top"
        link={{
          text: t('in-plg:datasources.noData.oTelCollector.emptyState_linktext'),
          href: 'https://ibm.biz/distribution-otel-collector'
        }}
        action={{
          kind: 'primary',
          text: t('in-plg:datasources.noData.oTelCollector.emptyState_buttontext'),
          onClick: () => {
            goToPath(datasourceOtemCollectorCatalog);
          }
        }}
      />
    );

  return (
    <section aria-label={t('in-plg:datasources.content')}>
      <LeftRightPadding>
        <Stack gap="1rem">
          <Button
            kind="ghost"
            renderIcon={() => <IconForButton icon="lib_openclose_add_circle_outline" iconSize="xs" />}
            href={createHrefToPath(datasourceOtemCollectorCatalog)}
          >
            {t('in-plg:datasources.installACollector')}
          </Button>
          <ServerTablePresenter<InfrastructureExploreItem, ServerTablePresenterProps<InfrastructureExploreItem>>
            columnDefinitions={columnDefinitions}
            result={collectorsResult}
            onChange={setServerTableUrlState}
            query={query}
            pageSize={pageSize}
            page={page}
            orderBy={orderBy}
            orderDirection={orderDirection}
            isSearchable
          />
          {canLoadMore && (
            <div className={locals.loadMoreButton}>
              <Button onClick={() => setRetrievalSize(size => size + LOAD_CHUNK_SIZE)} disabled={loading}>
                {loading ? t('in-plg:datasources.loading') : t('in-plg:datasources.loadMore')}
              </Button>
            </div>
          )}
        </Stack>
      </LeftRightPadding>
    </section>
  );
};

export default OTelCollector;

function HealthStatus(props: { entityHealthInfo?: { maxSeverity: number } }) {
  const { entityHealthInfo } = props;
  if (!entityHealthInfo) {
    return <HealthColumn label={t('in-plg:datasources.status.statusUnknown')} severity={0.1} />;
  }
  if (entityHealthInfo.maxSeverity > 5) {
    return <HealthColumn label={t('in-plg:datasources.status.statusCritical')} severity={1} />;
  }
  if (entityHealthInfo.maxSeverity > 0) {
    return <HealthColumn label={t('in-plg:datasources.status.statusWarning')} severity={0.5} />;
  }
  if (entityHealthInfo.maxSeverity === 0) {
    return <HealthColumn label={t('in-plg:datasources.status.statusHealthy')} severity={0} />;
  }
  return <HealthColumn label={t('in-plg:datasources.status.statusIssues')} severity={0.1} />;
}

const HealthColumn = ({ label, severity }: { label: string; severity: number }) => (
  <Stack orientation="horizontal" className={locals.healthWrapper}>
    <HealthDot severity={severity} />
    <Typography variant="body-compact-01">{label}</Typography>
  </Stack>
);
