import React from 'react';

import {selectedEventId$, isEventOpenAtFocusedMoment} from 'in-stores/events';
import {getEvent, selectEvent, clearEvent} from 'in-services/issueTracker';
import {formatDateTime} from 'in-services/formatters/date';
import {focusedMoment$} from 'in-stores/timeline';
import {getSnapshot} from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

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

      <Cell content={
        <Icon event={event} />
      } />
      <Cell content={formatDateTime(event.start)} />
      <Cell content={event.state === 'open'
        ? 'active'
        : formatDateTime(event.end)} />
      <Cell content={event.title} />
      <Cell content={
        <Entity snapshotId={event.snapshotId} />
      } />
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

const Icon = connectTo(props => {
  const event = props.event;
  return {
    selectedEventId: selectedEventId$,
    isOpen: focusedMoment$.map(focusedMoment =>
      isEventOpenAtFocusedMoment(event.start, event.end, event.state, focusedMoment)).distinct()
  };
},
function Icon({event, isOpen}) {
  const eventType = event.type;
  const defaultColor = '#92a5ae';
  let color = defaultColor;
  if (isOpen) {
    color = event.severity > 0 ? theme.health[event.severity] : defaultColor;
  }

  let iconType;
  if (eventType === 'incident') {
    iconType = 'incidents';
  } else if (eventType === 'change') {
    iconType = 'change2';
  } else if (eventType === 'issue') {
    if (event.severity < 10) {
      iconType = 'warning';
    } else {
      iconType = 'critical';
    }
  }
  return (
    <SvgIcon className={`${block}__icon`}
             type={iconType}
             width={12}
             height={12}
             color={color} />
  );
});

const Entity = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId)
  };
},
function EventTableRowEntity({snapshot}) {
  if (!snapshot) {
    return null;
  }

  return (
    <span>
      {getLabel(snapshot)}
    </span>
  );
});
