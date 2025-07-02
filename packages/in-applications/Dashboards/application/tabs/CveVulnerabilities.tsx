/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Module needs to be translated to TS
import getRawCVEEvents from 'in-subscription/getRawCVEEvents';
import DetectionColumnDefinitions from 'in-vulnerability-center/Dashboard/DetectionColumnDefinitions';
import { isConcertEnabledFromToken } from 'in-applications/Dashboards/application/tabs/utils';
import DetectionDetailDialog from 'in-vulnerability-center/Dashboard/DetectionDetailDialog';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConcertBanner from 'in-vulnerability-center/components/ConcertBanner';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { solisEnabled } from 'in-services/featureFlags';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/fixedObjects';
import { RawEvent } from 'in-types';
import { t } from 'in-i18n';

interface CVEEventsResponse {
  data?: CVEEventsResponseData;
}

interface CVEEventsResponseData {
  totalHits?: number;
}

export default function AffectedCvePresenter() {
  const { location } = useNavigation();
  const eventType = 'cve_issue';
  const timeConfig = useTimeConfig();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';

  const pathSegment = '/CveVulnerabilities';
  const matrixPrefix = '';

  const [isTableEmpty, setIsTableEmpty] = useState<boolean | null>(null);
  const isConcertEnabled = useMemo(() => isConcertEnabledFromToken(), []);

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

  const query = `event.type:${eventType} AND entity.application.id:"${appId}"`;

  const cveEventsData: CVEEventsResponse | undefined | null = useObservable(
    getRawCVEEvents({
      timeConfig,
      query,
      pagination: {
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 0,
          offset: -1
        },
        retrievalSize: 1
      },
      order: {
        by: 'problem.problemText',
        direction: 'ASC'
      }
    }),
    [timeConfig, appId]
  );

  useEffect(() => {
    const totalHits = cveEventsData?.data?.totalHits ?? 0;
    totalHits > 0 ? setIsTableEmpty(false) : setIsTableEmpty(true);
  }, [cveEventsData]);

  const handleOnRowClick = (item: RawEvent) => {
    addActiveDialog(<DetectionDetailDialog event={item} timeConfig={timeConfig} onClose={close} />);
  };

  const renderBanner = () => {
    if (!solisEnabled) {
      return <ConcertBanner expanded="showVulnerabilityInfoPanel" />;
    }

    if (isConcertEnabled) {
      const variation = isTableEmpty ? 'trialOnly' : 'trialConfig';
      return (
        // @ts-expect-error TS2304: Cannot find name solis
        // component is loaded from a script in ui-client/packages/in-client/index.html
        <solis-teaser product="concert" type="banner" variation="vulnerabilities" sub_variation={variation} />
      );
    }

    return (
      // @ts-expect-error TS2304: Cannot find name solis
      // component is loaded from a script in ui-client/packages/in-client/index.html
      <solis-teaser
        product="concert"
        type="banner"
        variation="vulnerabilities"
        sub_variation="noTrialNoOptim"
        product_context="instana"
      />
    );
  };

  return (
    <Stack gap="large">
      {renderBanner()}
      {(!solisEnabled || isConcertEnabled) && (
        <ServerTableWithUrlState
          get={fetchCVEEvents}
          timeConfig={timeConfig}
          title={t('in-vulnerability-center:detection.table.mainLabel')}
          rightHeader={noop}
          showHeaderCount
          onRowClick={handleOnRowClick}
        />
      )}
    </Stack>
  );
}
