import React from 'react';

import {FILTER} from 'in-components/eventView/stores/eventFilterStore';
import {selectEvent, clearEvent} from 'in-services/issueTracker';
import {formatDateTime} from 'in-services/formatters/date';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTableRow.less';


const block = 'in-event-view-event-table-row';

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
         onClick={() => toggleEvent(event, selectedEventId)}>
      {rowDefinition(event)}
    </div>
  );
});

function toggleEvent(event, selectedEventId) {
  event.get('id') !== selectedEventId
    ? selectEvent(event)
    : clearEvent(event);
}

function Cell({content, isIncident}) {
  return (
    <span className={isIncident ? `${block}__incident-cell` : `${block}__cell`}>
      {content}
    </span>
  );
}

function IncidentCell({content}) {
  return (
    <Cell content={content}
          isIncident={true} />
  );
}

function eventTableRowDefinition(event) {
  return [
    <Cell key='type'
          content={event.get('type')} />,
    <Cell key='start'
          content={formatDateTime(event.get('start'))} />,
    <Cell key='end'
          content={event.get('end') ? formatDateTime(event.get('end')) : 'active'} />,
    <Cell key='problem'
          content={event.getIn(['problem', 'problemText'])} />,
    <Cell key='entity'
          content={event.get('snapshotId')} />
  ];
}

function incidentTableRowDefinition(event) {
  return [
    <IncidentCell key='start'
                  content={formatDateTime(event.get('start'))} />,
    <IncidentCell key='end'
                  content={event.get('end') ? formatDateTime(event.get('end')) : 'active'} />,
    <IncidentCell key='problem'
                  content={'triggering problem text'} />,
    <IncidentCell key='on'
                  content={'triggering problem snapshot id'} />
  ];
}
