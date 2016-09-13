import React from 'react';

import {FILTER} from 'in-components/eventView/stores/eventFilterStore';
import {formatDateTime} from 'in-services/formatters/date';
import {selectEvent} from 'in-services/issueTracker';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTableRow.less';


const block = 'in-event-view-event-table-row';
const cellClassName = block + '__cell';
const incidentCellClassName = block + '__incident-cell';

export default connectTo({
  selectedEventId: selectedEventId$
},
({event, selectedEventId, activeEventFilter}) => {
  let className = block;
  if (selectedEventId === event.get('id')) {
    className += ` ${className}--selected`;
  }

  const rowDefinition = activeEventFilter === FILTER.INCIDENTS
    ? incidentTableRowDefinition
    : eventTableRowDefinition;

  return (
    <div className={className}
         onClick={() => selectEvent(event)}>
      {rowDefinition(event)}
    </div>
  );
});


function Cell({content, isIncident}) {
  return (
    <span className={isIncident ? incidentCellClassName : cellClassName}>
      {content}
    </span>
  );
}

function eventTableRowDefinition(event) {
  return [
    <Cell key='type' content={event.get('type')} />,
    <Cell key='start' content={formatDateTime(event.get('start'))} />,
    <Cell key='end' content={event.get('end') ? formatDateTime(event.get('end')) : 'active'} />,
    <Cell key='problem' content={event.getIn(['problem', 'problemText'])} />,
    <Cell key='entity' content={event.get('snapshotId')} />
  ];
}

function incidentTableRowDefinition(event) {
  return [
    <Cell isIncident={true} key='start' content={formatDateTime(event.get('start'))} />,
    <Cell isIncident={true} key='end' content={event.get('end') ? formatDateTime(event.get('end')) : 'active'} />,
    <Cell isIncident={true} key='problem' content={'triggering problem text'} />,
    <Cell isIncident={true} key='on' content={'triggering problem snapshot id'} />
  ];
}
