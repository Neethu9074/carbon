import {combineLatest} from 'reactive-observables';
import {create} from 'reactive-observables';
import Immutable from 'immutable';
import React from 'react';

import EventDetails from 'in-components/eventView/components/eventDetails/CollapsableEventDetails';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import './IncidentEventList.less';


const block = 'in-event-incident-event-list';

export default connectTo(props => {
  return {
    // HACK FOR FAKE EVENTS
    events: create().startWith(Immutable.fromJS([{
      id: 'id2',
      type: 'issue',
      start: Date.now() - 1000 * 40,
      problem: {
        fixSuggestion: 'fix it'
      },
      snapshotId: 'asd',
      title: 'incident incoming',
      severity: 5
    }, {
      id: 'id3',
      type: 'issue',
      start: Date.now() - 1000 * 40 * 10,
      end: Date.now() - 1000 * 30,
      problem: {
        fixSuggestion: 'fix it'
      },
      snapshotId: 'asd',
      title: 'incident incoming',
      severity: 5
    }])),
    events2: combineLatest(props.ids.map(id => getEvent(id)))
  };
},
function IncidentEventList({events}) {
  if (!events) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      {events.map(event => <EventDetails key={event.get('id')}
                                         event={event}
                                         isCollapsed={true} />)
      }
    </div>
  );
});
