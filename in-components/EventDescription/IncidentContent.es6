import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import getEventsWithinTimerange from 'in-hoc/getEventsWithinTimerange';
import SnapshotDescription from 'in-components/SnapshotDescription';
import {toHtml} from 'in-services/formatters/markdown';
import connectTo from 'in-hoc/connectTo';


const block = 'in-event-description';

export default getEventsWithinTimerange(
  connectTo(props => {
    if (props.events && props.events.size > 0) {
      return {
        color: getColorForEventAtFocusedMomentAsStream(props.events.get(0))
      };
    }
    return {};
  }, React.createClass({

  displayName: 'IncidentContent',

  propTypes: {
    incident: irpt.map.isRequired,
    color: React.PropTypes.string,
    events: irpt.list
  },

  render() {
    const events = this.props.events;
    const color = this.props.color;
    if (!events || events.size === 0 || !color) {
      return null;
    }

    const incident = this.props.incident;
    const firstEvent = events.get(0);

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

        <SnapshotDescription snapshotId={firstEvent.getIn(['problem', 'snapshotId'], '')}
                             time={firstEvent.get('start')}/>
      </div>
    );
  }
})));
