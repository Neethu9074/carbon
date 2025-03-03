/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Stack, TableSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  eventIdUrlParameter,
  orderDirectionParameter,
  orderByUrlParameter,
  pageNumberUrlParameter
} from 'in-events/navigation/urlParameters';
import DetectionColumnDefinitions from 'in-vulnerability-center/Dashboard/DetectionColumnDefinitions';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import DetectionDetailDialog from 'in-vulnerability-center/Dashboard/DetectionDetailDialog';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { vulnerabilitydetectionPath } from 'in-vulnerability-center/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConcertBanner from 'in-vulnerability-center/components/ConcertBanner';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import getRawCVEEvents from 'in-subscription/getRawCVEEvents';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/fixedObjects';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

export default function AffectedCvePresenter({ location }) {
  const eventType = 'cve_issue';
  const timeConfig = useTimeConfig();
  const appId = getMatrixParameter(location, '/application', 'appId') ?? '';
  const urlSettingsConfig = {
    bind: [eventIdUrlParameter, orderDirectionParameter, orderByUrlParameter, pageNumberUrlParameter],
    replaceHistory: false
  };
  const [urlState] = useUrlState(urlSettingsConfig);
  const { orderBy, orderDirection } = urlState;
  const pathSegment = vulnerabilitydetectionPath;
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
    isSearchable: false,
    pathSegment,
    matrixPrefix
  });

  const fetchCVEEvents = useCallback(
    ({ cursor }) =>
      getRawCVEEvents({
        timeConfig,
        query: `event.type:${eventType} AND entity.application.id:"${appId}"`,
        pagination: {
          retrievalSize: 30,
          cursor
        },
        order: {
          by: orderBy,
          direction: orderDirection
        }
      }),
    [timeConfig, orderBy, orderDirection, eventType, appId]
  );

  const cveEventsResult = useObservable(fetchCVEEvents({ cursor: null }), [timeConfig, orderBy, orderDirection]);

  if (isLoading(cveEventsResult)) {
    return (
      <>
        <ConcertBanner expanded="showVulnerabilityInfoPanel" />
        <TableSkeleton />
      </>
    );
  }

  if (isLoading(cveEventsResult)) {
    return <TableSkeleton />;
  }
  const handleOnRowClick = item => {
    addActiveDialog(<DetectionDetailDialog event={item} timeConfig={timeConfig} onClose={close} />);
  };

  return (
    <Stack gap="large">
      <ConcertBanner expanded="showVulnerabilityInfoPanel" />
      <ServerTableWithUrlState
        get={fetchCVEEvents}
        timeConfig={timeConfig}
        title={t('in-vulnerability-center:detection.table.mainLabel')}
        rightHeader={noop}
        showHeaderCount
        onRowClick={item => handleOnRowClick(item)}
      />
    </Stack>
  );
}

AffectedCvePresenter.propTypes = {
  location: PropTypes.any
};
