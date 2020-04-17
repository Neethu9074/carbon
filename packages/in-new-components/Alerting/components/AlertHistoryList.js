import PropTypes from 'prop-types';
import React from 'react';

import ListTitle from 'in-new-components/lists/Title';
import { Li, Ul } from 'in-new-components/lists/List';
import WithIcon from 'in-new-components/WithIcon';
import { getDesignLibraryColorBySeverity, getIcon } from 'in-stores/events';
import connect from 'in-hoc/connectTo';
import { timeConfig$ } from 'in-stores/time/config';
import getRawEvents from 'in-subscription/getRawEvents';
import { alertingDialogChartTimeframe } from 'in-websites/alerting/constants';
import { pendingResult } from 'in-services/fixedObjects';
import locals from 'in-events/components/EventsListRowDense.mless';
import { formatDateTime } from 'in-services/formatters/date';

export const AlertHistoryListPresenter = ({ rawEvents }) => {
  const { data = {}, progress = {} } = rawEvents;
  const { loading } = progress;
  if (loading) {
    return (
      <>
        <ListTitle>Alerts created</ListTitle>
        <p>Loading ...</p>
      </>
    );
  }
  const { items = [], totalRepresentedItemCount } = data;
  return (
    <>
      <ListTitle>Alerts created ({totalRepresentedItemCount})</ListTitle>
      <Ul>
        {items.map(e => {
          return (
            <Li key={e.id}>
              <WithIcon icon={getIcon({ event: e })} iconColor={getDesignLibraryColorBySeverity(e.severity)}>
                <div className={locals.label}>
                  <time dateTime={new Date(e.start).toISOString()}>{formatDateTime(e.start)}</time>
                </div>
              </WithIcon>
            </Li>
          );
        })}
      </Ul>
    </>
  );
};

AlertHistoryListPresenter.propTypes = {
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

const AlertHistoryList = connect(({ alertConfigId, timeConfig }) => {
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
    }).startWith(pendingResult),
  };
})(AlertHistoryListPresenter);

export default AlertHistoryList;
