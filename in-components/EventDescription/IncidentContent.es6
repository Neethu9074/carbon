import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import SnapshotDescription from 'in-components/SnapshotDescription';
import {toHtml} from 'in-services/formatters/markdown';
import {emptyList} from 'in-services/fixedImmutables';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';


const rpt = React.PropTypes;
const block = 'in-event-description';

export default connectTo(props => {
  const idsList = props.incident.get('recentEvents', emptyList).map(id => getEvent(id));
  const subscriptions = {
    events: combineLatest(idsList.toArray())
  };
  if (props.events && props.events.size > 0) {
    subscriptions.color = getColorForEventAtFocusedMomentAsStream(props.events.get(0));
  }
  return subscriptions;
},
React.createClass({

  displayName: 'IncidentContent',

  propTypes: {
    incident: irpt.map.isRequired,
    color: rpt.string,
    events: rpt.array
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
}));
