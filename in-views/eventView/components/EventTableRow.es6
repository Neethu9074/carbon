import React from 'react';

import { getEvent, selectEvent, clearEvent, getIconTypeForEventType, getEventType } from 'in-services/issueTracker';
import { fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { formatDateTime } from 'in-services/formatters/date';
import PluginIcon from 'in-components/PluginIcon';
import { selectedEventId$ } from 'in-stores/events';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import { theme } from 'in-services/theme';
import connectTo from 'in-hoc/connectTo';

import './EventTableRow.less';

const block = 'in-event-view-event-table-row';

export default connectTo(
  props => {
    return {
      event: getEvent(props.rawEvent.id),
      selectedEventId: selectedEventId$
    };
  },
  ({ rawEvent, event, selectedEventId }) => {
    if (!event) {
      return null;
    }

    let className = block;
    if (selectedEventId === rawEvent.id) {
      className += ` ${className}--selected`;
    }

    return (
      <div className={className} onClick={() => toggleEvent(event, selectedEventId)}>
        <Cell content={<Icon event={event} />} />
        <Cell content={formatDateTime(event.get('triggeringTime', event.get('start')))} />
        <Cell content={event.get('state') === 'open' ? 'active' : formatDateTime(event.get('end'))} />
        <Cell content={rawEvent.title} />
        <Cell content={<Entity snapshotId={rawEvent.snapshotId} time={event.get('start')} />} />
      </div>
    );
  }
);

function toggleEvent(event, selectedEventId) {
  event.get('id') !== selectedEventId ? selectEvent(event) : clearEvent();
}

function Cell({ content }) {
  return (
    <div className={`${block}__cell`}>
      {content}
    </div>
  );
}

const Icon = connectTo(
  props => {
    return {
      selectedEventId: selectedEventId$,
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
    };
  },
  function Icon({ event, isOpen }) {
    const severity = event.getIn(['problem', 'severity']);
    const defaultColor = '#92a5ae';
    let color = defaultColor;
    if (isOpen) {
      color = severity > 0 ? theme.health[severity] : defaultColor;
    }

    const iconType = getIconTypeForEventType(getEventType(event), true);
    return (
      <div
        style={{
          background: color
        }}
        className={`${block}__icon-cell`}
      >
        <SvgIcon className={`${block}__icon`} type={iconType} height={12} color="#40535b" />
      </div>
    );
  }
);

const Entity = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId, props.time)
    };
  },
  function EventTableRowEntity({ snapshot }) {
    if (!snapshot) {
      return null;
    }
    return (
      <div className={`${block}__entity-wrapper`}>
        <PluginIcon className={`${block}__entity-icon`} dimension={14} color="#000" snapshot={snapshot} />
        <span>
          {getLabel(snapshot)}
        </span>
      </div>
    );
  }
);
