/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback } from 'react';

import { Stack } from '@instana/components';

// import { vulnerabilitydetectionPath } from 'in-vulnerability-center/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Module needs to be translated to TS
import getRawCVEEvents from 'in-subscription/getRawCVEEvents';
import DetectionColumnDefinitions from 'in-vulnerability-center/Dashboard/DetectionColumnDefinitions';
import DetectionDetailDialog from 'in-vulnerability-center/Dashboard/DetectionDetailDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConcertBanner from 'in-vulnerability-center/components/ConcertBanner';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { solisEnabled } from 'in-services/featureFlags';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/fixedObjects';
import { RawEvent } from 'in-types';
import { t } from 'in-i18n';

export default function AffectedCvePresenter() {
  const { location } = useNavigation();

  const eventType = 'cve_issue';
  const timeConfig = useTimeConfig();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';

  const pathSegment = '/CveVulnerabilities';
  const matrixPrefix = '';

  const ServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions: DetectionColumnDefinitions,
      title: t('in-vulnerability-center:cves.table.noCveAvailableTitle'),
      description: t('in-vulnerability-center:cves.table.noCveAvailableDescription')
    }),
    paginationResettingUrlParameters: [timeConfigUrlParameters],
    columnDefinitions: DetectionColumnDefinitions,
    defaultOrderBy: 'problem.problemText',
    defaultOrderDirection: 'ASC',
    isSearchable: true,
    pathSegment,
    matrixPrefix
  });

  interface FetchParams {
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    page?: number;
    pageSize?: number;
  }

  const fetchCVEEvents = useCallback(
    ({ orderBy = 'problem.problemText', orderDirection = 'ASC', page = 1, pageSize = 30 }: FetchParams) => {
      let query = `event.type:${eventType} AND entity.application.id:"${appId}"`;
      let searchQuery = location?.matrix?.[pathSegment]?.query;
      if (location?.query?.q) {
        query += ` AND (${location.query.q})`;
      }
      if (searchQuery) {
        searchQuery = searchQuery.replace(/-/g, ' ');
        query += ` AND (event.text:*${searchQuery}*)`;
      }
      const offset = page > 1 ? (page - 1) * pageSize - 1 : -1;
      return getRawCVEEvents({
        timeConfig,
        query,
        pagination: {
          cursor: {
            '@class': '.IngestionOffsetCursor',
            ingestionTime: 0,
            offset
          },
          retrievalSize: pageSize
        },
        order: {
          by: orderBy,
          direction: orderDirection
        }
      });
    },
    [timeConfig, appId, location]
  );

  const handleOnRowClick = (item: RawEvent) => {
    addActiveDialog(<DetectionDetailDialog event={item} timeConfig={timeConfig} onClose={close} />);
  };

  return (
    <Stack gap="large">
      {!solisEnabled && <ConcertBanner expanded="showVulnerabilityInfoPanel" />}
      <ServerTableWithUrlState
        get={fetchCVEEvents}
        timeConfig={timeConfig}
        title={t('in-vulnerability-center:detection.table.mainLabel')}
        rightHeader={noop}
        showHeaderCount
        onRowClick={handleOnRowClick}
      />
    </Stack>
  );
}
