import React from 'react';

import {getEvent, selectEvent, clearEvent} from 'in-services/issueTracker';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTableRow.less';


const block = 'in-event-view-event-table-row';

export default connectTo({
  selectedEventId: selectedEventId$
},
({event, selectedEventId}) => {
  let className = block;
  if (selectedEventId === event.id) {
    className += ` ${className}--selected`;
  }

  return (
    <div className={className}
         onClick={() => toggleEvent(event, selectedEventId)}>

      <Cell content={event.start} />
      <Cell content={event.end} />
      <Cell content={event.title} />
      <Cell content={event.severity} />
    </div>
  );
});

function toggleEvent(event, selectedEventId) {
  getEvent(event.id).once(_event => {
    event.id !== selectedEventId
    ? selectEvent(_event)
    : clearEvent(_event);
  });
}

function Cell({content}) {
  return (
    <span className={`${block}__cell`}>
      {content}
    </span>
  );
}
