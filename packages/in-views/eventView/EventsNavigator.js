import React from 'react';

import { loadMoreRawEvents, rawEventList$, furtherDataAvailable$ } from 'in-views/eventView/stores/rawEventListStore';
import { Table, Thead, Tbody, Tr, Th, Td, LoadMoreRow } from 'in-components/tables/sharedComponents';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  { rawEventList: rawEventList$, furtherDataAvailable: furtherDataAvailable$ },
  function EventsNavigator({ eventId, onChange, rawEventList, furtherDataAvailable }) {
    return (
      <HeightRestrictedView
        render={() => (
          <Table tableInCard>
            <Thead>
              <Tr size="compact">
                <Th>Event Id</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rawEventList.map(event => (
                <Tr
                  key={event.id}
                  size="compact"
                  active={event.id === eventId}
                  onClick={() => {
                    onChange({ eventId: event.id });
                  }}
                >
                  <Td>{event.id}</Td>
                </Tr>
              ))}

              {furtherDataAvailable && <LoadMoreRow loadMore={loadMoreRawEvents} size="compact" cols={1} />}
            </Tbody>
          </Table>
        )}
      />
    );
  }
);
