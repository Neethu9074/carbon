/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Li, LiLoadMore, Link, Ul } from '@instana/components';

import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/components/SmartAlertsNoDataAvailable';
import { getDesignLibraryColorBySeverity, getIcon, getEventType } from 'in-stores/events';
import { formatDateTime, formatDurationAccurately } from 'in-services/formatters/date';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import useCursorPagination from 'in-hooks/useCursorPagination';
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
        {items.map(event => {
          const viewFilterParams = {
            eventId: event.id,
            eventTypeFilter: 'issue',
            timeConfig
          };
          if (event.entityType === 'App20') {
            viewFilterParams.applicationId = event.entityId;
          }

          const analyseEvent$ = getEventsViewFilteredBy(viewFilterParams);
          const eventType = getEventType(event);

          return (
            <Li key={event.id}>
              <Link href$={analyseEvent$} ellipsis>
                <WithIcon icon={getIcon(eventType)} iconColor={getDesignLibraryColorBySeverity(event.severity)}>
                  <div className={locals.label}>
                    <time dateTime={new Date(event.start).toISOString()}>{formatDateTime(event.start)}</time>
                    &nbsp;
                    <span>{`(${getDurationOrActive(event)})`}</span>
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

function getDurationOrActive(event) {
  if (event.state === 'closed') {
    return formatDurationAccurately(event.end - event.start, 60000);
  }
  return t('in-alerting:components.alertStateActive');
}

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
