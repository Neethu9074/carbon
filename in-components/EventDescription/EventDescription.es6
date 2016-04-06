/* eslint-disable react/no-multi-comp */
import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getColorForEvent, selectEvent, getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {toHtml} from 'in-services/formatters/markdown';
import {getClassName} from 'in-services/react';
import getSnapshot from 'in-hoc/getSnapshot';
import getEvent from 'in-hoc/getEvent';

import SnapshotDescription from '../SnapshotDescription';
import Icon from '../Icon';

import './EventDescription.less';


const rpt = React.PropTypes;
const block = 'in-event-description';

export default getSnapshot(React.createClass({

  displayName: 'EventDescription',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    event: irpt.map.isRequired,
    className: rpt.string,
    snapshot: irpt.map
  },

  render() {
    const event = this.props.event;
    const color = getColorForEvent(event);
    const className = getClassName(this, block);
    const eventType = getEventType(event);

    return (
      <div className={className}
           onClick={() => selectEvent(event)}>
        <Icon className={block + '__icon'}
              type={this.getIconType(eventType)}
              style={{color}}/>
        <div className={block + '__description'}>
          <div className={getClassName(this, block, '__time')}>
            {moment(event.get('start')).fromNow()}
          </div>

          {this.getContent(event, eventType, color)}
        </div>
      </div>
    );
  },

  getIconType(eventType) {
    switch (eventType) {
      case EVENT_TYPES.ISSUE_WARNING:
        return 'warning';
      case EVENT_TYPES.ISSUE_CRITICAL:
        return 'critical';
      case EVENT_TYPES.INCIDENT:
        return 'system';
      default:
        return 'instana_change';
    }
  },

  getContent(event, eventType, color) {
    if (eventType === EVENT_TYPES.INCIDENT) {
      console.log(event.toJS());
      return (
        <IncidentContent incident={event}
                         eventId={event.getIn(['recentEvents', 0])} />
      );
    }

    return (
      <div>
        <div className={block + '__header'}
             style={{color}}>
          {event.getIn(['problem', 'problemText'])}
        </div>

        <div className={block + '__suggestion'}
             dangerouslySetInnerHTML={{__html: toHtml(event.getIn(['problem', 'fixSuggestion']))}} />

        <SnapshotDescription snapshot={this.props.snapshot} />
      </div>
    );
  }
}));

const IncidentContent = getEvent(
  React.createClass({

    displayName: 'EventDescription',

    propTypes: {
      incident: irpt.map.isRequired,
      event: irpt.map
    },

    render() {
      const firstEvent = this.props.event;
      if (!firstEvent) {
        return null;
      }

      const incident = this.props.incident;
      const color = getColorForEvent(firstEvent);

      return (
        <div>
          <div className={block + '__header'}>
            {'incident (' + incident.get('recentEvents').size + ' events)'}
          </div>
          <span className={block + '__incident-started'}>
            started here:
          </span>
          <div className={block + '__header'}
               style={{color}}>
            {firstEvent.getIn(['problem', 'problemText'])}
          </div>
          <div className={block + '__suggestion'}
               dangerouslySetInnerHTML={{__html: toHtml(firstEvent.getIn(['problem', 'fixSuggestion']))}} />
        </div>
      );
    }
  })
);
