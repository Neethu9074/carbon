/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { LiLoadMore } from '@instana/components';
import { Li, Ul } from '@instana/components';
import { Link } from '@instana/components';

import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/applications/components/SmartAlertsNoDataAvailable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { getDesignLibraryColorBySeverity, getIcon } from 'in-stores/events';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import { propTypeTimeConfig } from 'in-stores/time/config';
import getRawEvents from 'in-subscription/getRawEvents';
import { isLoading } from 'in-services/util/result';
import ListTitle from 'in-components/lists/Title';
import WithIcon from 'in-components/WithIcon';
import { t } from 'in-i18n';

import locals from 'in-events/components/EventsListRowDense.mless';

export const AlertHistoryListPresenter = ({ timeConfig, tableProps }) => {
  const { canLoadMore, items = [], totalRepresentedItemCount = 0, loadMore } = tableProps;
  const loading = isLoading(tableProps);
  return (
    <>
      <ListTitle>
        {t('in-alerting:components.alertHistoryListTitleWithTotalRepresentedItemCount', {
          totalRepresentedItemCount
        })}
      </ListTitle>
      <Ul>
        {items.map(e => {
          const viewFilterParams = {
            eventId: e.id,
            eventTypeFilter: 'issue',
            timeConfig
          };
          if (e.entityType === 'App20') {
            viewFilterParams.applicationId = e.entityId;
          }

          const analyseEvent$ = getEventsViewFilteredBy(viewFilterParams);

          return (
            <Li key={e.id}>
              <Link href$={analyseEvent$} ellipsis>
                <WithIcon icon={getIcon({ event: e })} iconColor={getDesignLibraryColorBySeverity(e.severity)}>
                  <div className={locals.label}>
                    <time dateTime={new Date(e.start).toISOString()}>{formatDateTime(e.start)}</time>
                  </div>
                </WithIcon>
              </Link>
            </Li>
          );
        })}
        {canLoadMore && <LiLoadMore loadMore={loadMore} />}
        {loading && <LoadingList numSkeletonRows={items?.length ? 1 : 3} />}
        {!loading && !items?.length && (
          <SmartAlertsNoDataAvailable
            text={t('in-alerting:smartAlerts.titleNoSmartAlertsCreated')}
            type="lib_alerts_alert"
          />
        )}
      </Ul>
    </>
  );
};

AlertHistoryListPresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  tableProps: PropTypes.shape({
    canLoadMore: PropTypes.bool,
    items: PropTypes.array,
    totalRepresentedItemCount: PropTypes.any,
    loadMore: PropTypes.func
  })
};

export default function AlertHistoryList(props) {
  const { alertConfigId, timeConfig } = props;
  const tableProps = useCursorPagination(
    ({ cursor }) =>
      getRawEvents({
        timeConfig,
        query: `(event.specification.id:"${alertConfigId}") AND (event.type:issue)`,
        pagination: {
          cursor,
          retrievalSize: 15
        },
        order: {
          by: 'start',
          direction: 'DESC'
        }
      }),
    [alertConfigId, timeConfig]
  );

  return (
    <AlertDetailsCard>
      <AlertHistoryListPresenter {...props} tableProps={tableProps} />
    </AlertDetailsCard>
  );
}
