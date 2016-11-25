import React from 'react';

import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {getEvent, selectEvent, clearEvent} from 'in-services/issueTracker';
import {formatDateTime} from 'in-services/formatters/date';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {selectedEventId$} from 'in-stores/events';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './EventTableRow.less';


const block = 'in-event-view-event-table-row';

export default connectTo(props => {
  return {
    event: getEvent(props.rawEvent.id),
    selectedEventId: selectedEventId$
  };
},
({rawEvent, event, selectedEventId}) => {
  if (!event) {
    return null;
  }

  let className = block;
  if (selectedEventId === rawEvent.id) {
    className += ` ${className}--selected`;
  }

  return (
    <div className={className}
         onClick={() => toggleEvent(event, selectedEventId)}>

      <Cell content={
        <Icon event={event} />
      } />
      <Cell content={formatDateTime(event.get('start'))} />
      <Cell content={event.get('state') === 'open'
        ? 'active'
        : formatDateTime(event.get('end'))} />
      <Cell content={rawEvent.title} />
      <Cell content={
        <Entity snapshotId={rawEvent.snapshotId}
                time={event.get('start')} />
      } />
    </div>
  );
});

function toggleEvent(event, selectedEventId) {
  event.get('id') !== selectedEventId
    ? selectEvent(event)
    : clearEvent();
}

function Cell({content}) {
  return (
    <div className={`${block}__cell`}>
      {content}
    </div>
  );
}

const Icon = connectTo(props => {
  return {
    selectedEventId: selectedEventId$,
    isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
  };
},
function Icon({event, isOpen}) {
  const eventType = event.get('type');
  const severity = event.getIn(['problem', 'severity']);
  const defaultColor = '#92a5ae';
  let color = defaultColor;
  if (isOpen) {
    color = severity > 0 ? theme.health[severity] : defaultColor;
  }

  let iconType;
  if (eventType === 'incident') {
    iconType = 'incidents';
  } else if (eventType === 'change') {
    iconType = 'change2';
  } else if (eventType === 'issue') {
    if (severity < 10) {
      iconType = 'warning';
    } else {
      iconType = 'critical';
    }
  }
  return (
    <div style={{
      background: color
    }}
    className={`${block}__icon-cell`}>
      <SvgIcon className={`${block}__icon`}
               type={iconType}
               height={12}
               color='#40535b' />
    </div>
  );
});

const Entity = connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId, props.time)
  };
}, function EventTableRowEntity({snapshot}) {
  if (!snapshot) {
    return null;
  }
  const entityType = getSingular(snapshot.get('plugin'));

  return (
    <div className={`${block}__entity-wrapper`}>
      <img src={getIcon(snapshot)}
           alt={`Icon for entities of type ${entityType}`}
           className={`${block}__entity-icon`} />
      <span>
        {getLabel(snapshot)}
      </span>
    </div>
  );
});
