/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import EmptyList from 'in-new-components/lists/List/sharedComponents/EmptyList';
import { getDesignLibraryColorBySeverity, getIcon } from 'in-stores/events';
import { formatDateTime } from 'in-services/formatters/date';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { pendingResult } from 'in-services/fixedObjects';
import getRawEvents from 'in-subscription/getRawEvents';
import ListTitle from 'in-new-components/lists/Title';
import { Li, Ul } from 'in-new-components/lists/List';
import WithIcon from 'in-new-components/WithIcon';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from 'in-events/components/EventsListRowDense.mless';

export const AlertHistoryListPresenter = ({ rawEvents, timeConfig }) => {
  const { data = {}, progress = {} } = rawEvents;
  const { loading } = progress;
  if (loading) {
    return (
      <>
        <ListTitle>{t('in-new-components:alerting.components.alertHistoryListTitle')}</ListTitle>
        <LoadingList />
      </>
    );
  }
  const { items = [], totalRepresentedItemCount } = data;
  return (
    <>
      <ListTitle>
        {t('in-new-components:alerting.components.alertHistoryListTitleWithTotalRepresentedItemCount', {
          totalRepresentedItemCount: totalRepresentedItemCount
        })}
      </ListTitle>
      {items.length > 0 && (
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
        </Ul>
      )}
      {items.length === 0 && <EmptyList />}
    </>
  );
};

AlertHistoryListPresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  rawEvents: PropTypes.shape({
    data: PropTypes.shape({
      items: PropTypes.array,
      totalRepresentedItemCount: PropTypes.any
    }),
    progress: PropTypes.shape({
      loading: PropTypes.bool
    })
  })
};

export default connect(({ alertConfigId, timeConfig }) => {
  return {
    rawEvents: getRawEvents({
      timeConfig,
      query: `(event.specification.id:${alertConfigId}) AND (event.type:issue)`,
      pagination: {
        retrievalSize: 200
      },
      order: {
        by: 'start',
        direction: 'DESC'
      }
    }).startWith(pendingResult)
  };
})(AlertHistoryList);

function AlertHistoryList(props) {
  return (
    <AlertDetailsCard>
      <AlertHistoryListPresenter {...props} />
    </AlertDetailsCard>
  );
}
