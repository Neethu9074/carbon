import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/eventDetails/EventDependecyGraph';
import Header from 'in-components/eventView/components/eventDetails/EventDetails/Header';
import EventProblem from 'in-components/eventView/components/eventDetails/EventProblem';
import EventTraces from 'in-components/eventView/components/eventDetails/EventTraces';
import EventChart from 'in-components/eventView/components/eventDetails/EventChart';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventDetails.less';


const rpt = React.PropTypes;
const block = 'in-event-view-event-details';

export default connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae')
  };
},
React.createClass({

  displayName: 'EventDetails',

  propTypes: {
    event: irpt.map.isRequired,
    isCollapsed: rpt.bool,
    color: rpt.string
  },

  getInitialState() {
    return {
      isCollapsed: true
    };
  },

  componentWillMount() {
    this.setState({
      isCollapsed: this.props.isCollapsed
    });
  },

  render() {
    const isCollapsed = this.state.isCollapsed;
    const event = this.props.event;
    const color = this.props.color;

    return (
      <div className={block}
           style={{ borderLeft: `5px solid ${color}` }}>

        <Header event={event}
                isCollapsed={isCollapsed}
                onClick={() => this.setState({isCollapsed: !isCollapsed})} />

        {isCollapsed
          ? null
          : [
              <EventProblem key='problem'
                            event={event} />,
              <EventChart key='chart'
                            event={event} />,
              <EventDependecyGraph key='graph'
                            event={event} />,
              <EventTraces key='trace'
                            event={event} />
            ]
        }
      </div>
    );
  }
}));
