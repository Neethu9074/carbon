import irpt from 'react-immutable-proptypes';
import React from 'react';

import getEventsWithinTimerange from 'in-hoc/getEventsWithinTimerange';
import SnapshotDescription from 'in-components/SnapshotDescription';
import * as issueTracker from 'in-services/issueTracker';
import {toHtml} from 'in-services/formatters/markdown';
import connectTo from 'in-hoc/connectTo';


const block = 'in-event-description';

export default getEventsWithinTimerange(
  connectTo(props => {
    const event = props.events ? props.events.get(0) : null;
    return {
      color: issueTracker.getColorForEvent(event)
    };
  }, React.createClass({

    displayName: 'IncidentContent',

    propTypes: {
      incident: irpt.map.isRequired,
      color: React.PropTypes.any,
      events: irpt.list
    },

    render() {
      const events = this.props.events;
      if (!events || events.size === 0) {
        return null;
      }

      const incident = this.props.incident;
      const firstEvent = events.get(0);
      const color = this.props.color;

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

          <SnapshotDescription snapshotId={firstEvent.getIn(['problem', 'snapshotId'], '')} />
        </div>
      );
    }
  }))
);
