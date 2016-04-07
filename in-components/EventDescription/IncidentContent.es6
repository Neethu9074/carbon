/* eslint-disable react/no-multi-comp */
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getEventsWithinTimerange} from 'in-stores/eventsWithinTimerange';
import SnapshotDescription from 'in-components/SnapshotDescription';
import * as issueTracker from 'in-services/issueTracker';
import {toHtml} from 'in-services/formatters/markdown';
import {emptyList} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';


const block = 'in-event-description';
const rpt = React.PropTypes;


export default connectTo(
  props => {
    return {
      events: getEventsWithinTimerange({
        from: props.incident.get('start'),
        to: props.incident.get('end'),
        eventIds: props.incident.get('recentEvents', emptyList).toArray()
      })
    };
  },
  React.createClass({

    displayName: 'IncidentContent',

    propTypes: {
      incident: irpt.map.isRequired,
      events: rpt.array
    },

    render() {
      if (!this.props.events || this.props.events.length === 0) {
        return null;
      }

      const firstEvent = this.props.events.sort((a, b) => a.get('start') - b.get('start'))[0];
      const incident = this.props.incident;
      const color = issueTracker.getColorForEvent(firstEvent);

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

          <SnapshotDescription snapshotId={firstEvent.getIn(['problem', 'snapshotId'])} />
        </div>
      );
    }
  })
);
