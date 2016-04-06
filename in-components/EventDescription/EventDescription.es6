/* eslint-disable react/no-multi-comp */
import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {getColorForEvent, selectEvent, getEvent, getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {toHtml} from 'in-services/formatters/markdown';
import {emptyList} from 'in-services/fixedImmutables';
import {getClassName} from 'in-services/react';
import getSnapshot from 'in-hoc/getSnapshot';
import connectTo from 'in-hoc/connectTo';

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
      return (
        <IncidentContent incident={event}
                         eventIds={event.get('recentEvents', emptyList).toArray()}
                         to={event.get('start')} />
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

const IncidentContent = connectTo(
  props => {
    return {
      events: combineLatest(props.eventIds.map(id => getEvent(id, props.to)))
    };
  },
  React.createClass({

    displayName: 'EventDescription',

    propTypes: {
      eventIds: rpt.array.isRequired,
      incident: irpt.map.isRequired,
      events: rpt.array
    },

    render() {
      if (!this.props.events || this.props.events.length === 0) {
        return null;
      }

      const firstEvent = this.props.events.sort((a, b) => a.get('start') - b.get('start'))[0];
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
