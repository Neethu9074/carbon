import React from 'react';

import {FILTER} from 'in-components/eventView/stores/eventFilterStore';
import {formatDateTime} from 'in-services/formatters/date';
import {selectEvent} from 'in-services/issueTracker';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTableRow.less';


const block = 'in-event-view-event-table-row';
const cellClassName = block + '__cell';

export default connectTo({
  selectedEventId: selectedEventId$
},
function EventTableRow({event, selectedEventId, activeEventFilter}) {
  let className = block;
  if (selectedEventId === event.get('id')) {
    className += ` ${className}--selected`;
  }

  return (
    <div className={className}
         onClick={() => selectEvent(event)}>

      <Cell content={event.get('type')} />
      <Cell content={formatDateTime(event.get('start'))} />
      <Cell content={event.get('end') ? formatDateTime(event.get('end')) : 'active'} />
      <Cell content={event.getIn(['problem', 'problemText'])} />

      {activeEventFilter === FILTER
        ? <Cell content={event.get('affected', 0)} />
        : <Cell content={event.get('snapshotId')} />
      }

    </div>
  );
});


function Cell({content}) {
  return (
    <span className={cellClassName}>
      {content}
    </span>
  );
}
