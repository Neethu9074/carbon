/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from 'react';

import { Typography } from '@instana/components';
import { Button, Stack } from '@instana/carbon';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { datasourceOtemCollectorCatalog } from 'in-plg/navigation/paths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-plg/pages/Datasource/OTelCollector/OTelCollector.mless';

export interface Collector {
  label?: string;
  entityHealthInfo?: { maxSeverity: number };
  metrics?: Map<string, any>;
  plugin?: string;
  snapshotId: string;
}

interface GetCollectorsProps {
  timeConfig: TimeConfig;
  retrievalSize: number;
}

const LOAD_CHUNK_SIZE = 10;

const OTelCollector = () => {
  const timeConfig = useTimeConfig();
  const { createHrefToPath } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [retrievalSize, setRetrievalSize] = useState(LOAD_CHUNK_SIZE);
  const collectorsResult = useObservable(getCollectors({ timeConfig, retrievalSize }), [timeConfig, retrievalSize]);
  //convert to unknown to avoid type error
  const collectors = collectorsResult?.data?.items as unknown as Collector[];
  const totalHits = collectorsResult?.data?.totalHits ?? 0;
  const errors = collectorsResult?.errors;

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
      getContent: (row: Collector) => <Typography variant="body-compact-01">{row.label}</Typography>
    },
    {
      id: 'health',
      label: t('in-plg:datasources.health'),
      getContent: (row: Collector) => <HealthStatus entityHealthInfo={row.entityHealthInfo} />
    }
  ];

  const canLoadMore = collectors?.length < totalHits;

  function getCollectors({ timeConfig, retrievalSize }: GetCollectorsProps) {
    return getEntities({
      filter: {
        tagFilterExpression: {
          logicalOperator: 'AND',
          type: 'EXPRESSION',
          elements: [
            {
              name: 'otel.attribute.entity.type',
              operator: 'EQUALS',
              value: 'otel-collector',
              type: 'TAG_FILTER',
              entity: NOT_APPLICABLE
            }
          ]
        },
        timeConfig
      },
      order: { by: 'id', direction: 'ASC' },
      type: 'openTelemetry',
      pagination: { retrievalSize }
    });
  }

  return (
    <LeftRightPadding>
      <Stack gap="1rem">
        <Button
          kind="ghost"
          renderIcon={() => <IconForButton icon="lib_openclose_add_circle_outline" iconSize="xs" />}
          href={createHrefToPath(datasourceOtemCollectorCatalog)}
        >
          {t('in-plg:datasources.installACollector')}
        </Button>
        <ServerTablePresenter<Collector, ServerTablePresenterProps<Collector>>
          columnDefinitions={columnDefinitions}
          result={{
            progress: { loading },
            errors: errors ?? [],
            data: {
              items: collectors ?? [],
              page: 0,
              pageSize: collectors?.length,
              totalHits: collectors?.length
            }
          }}
          page={0}
          pageSize={collectors?.length}
          orderBy="id"
          orderDirection="ASC"
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
