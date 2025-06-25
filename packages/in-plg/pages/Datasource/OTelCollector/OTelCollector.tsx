/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect } from 'react';

import { Button, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
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
    </LeftRightPadding>
  );
};

export default OTelCollector;

function HealthStatus(props: { entityHealthInfo?: { maxSeverity: number } }) {
  const { entityHealthInfo } = props;
  if (!entityHealthInfo) {
    return <span className={locals.healthUnknown}>{t('in-plg:datasources.status.statusUnknown')}</span>;
  }
  if (entityHealthInfo.maxSeverity > 5) {
    return <span className={locals.healthCritical}>{t('in-plg:datasources.status.statusCritical')}</span>;
  }
  if (entityHealthInfo.maxSeverity > 0) {
    return <span className={locals.healthWarning}>{t('in-plg:datasources.status.statusWarning')}</span>;
  }
  if (entityHealthInfo.maxSeverity === 0) {
    return <span className={locals.healthHealthy}>{t('in-plg:datasources.status.statusHealthy')}</span>;
  }
  return <span className={locals.healthUnknown}>{t('in-plg:datasources.status.statusIssues')}</span>;
}
