import PropTypes from 'prop-types';
import React from 'react';

import { getDesignLibraryColorBySeverity, getIcon } from 'in-stores/events';
import { formatDateTime } from 'in-services/formatters/date';
import { pendingResult } from 'in-services/fixedObjects';
import getRawEvents from 'in-subscription/getRawEvents';
import ListTitle from 'in-new-components/lists/Title';
import { Li, Ul } from 'in-new-components/lists/List';
import WithIcon from 'in-new-components/WithIcon';
import connect from 'in-hoc/connectTo';

import locals from 'in-events/components/EventsListRowDense.mless';

export const AlertHistoryListPresenter = ({ rawEvents }) => {
  const { data = {}, progress = {} } = rawEvents;
  const { loading } = progress;
  if (loading) {
    return (
      <>
        <ListTitle>Alerts Created</ListTitle>
        <p>Loading ...</p>
      </>
    );
  }
  const { items = [], totalRepresentedItemCount } = data;
  return (
    <>
      <ListTitle>Alerts Created ({totalRepresentedItemCount})</ListTitle>
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
    }).startWith(pendingResult)
  };
})(AlertHistoryListPresenter);

export default AlertHistoryList;
