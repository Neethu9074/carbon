import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDependecyGraph from 'in-components/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-components/eventView/components/ProblemDescription';
import EntityInformation from 'in-components/eventView/components/EntityInformation';
import {highlightedEventId$} from 'in-components/eventView/stores/highlightedEvent';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EventTraces from 'in-components/eventView/components/EventTraces';
import EventChart from 'in-components/eventView/components/EventChart';
import {formatTime} from 'in-services/formatters/date';
import EventIcon from 'in-components/EventIcon';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-components/eventView/components/Incident/EventListItem.less';


const rpt = React.PropTypes;
const block = 'in-event-view-incident-event-list-item';

export default connectTo(props => {
  return {
    background: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae'),
    highlightedEventId: highlightedEventId$
  };
},
React.createClass({

  displayName: 'EventListItem',

  propTypes: {
    highlightedEventId: rpt.string,
    event: irpt.map.isRequired,
    background: rpt.string
  },

  getInitialState() {
    return {
      isExpanded: false
    };
  },

  render() {
    const isExpanded = this.state.isExpanded;
    const background = this.props.background;
    const event = this.props.event;

    let className = `${block}__right`;
    if (this.props.highlightedEventId === event.get('id')) {
      className += ` ${className}--highlighted`;
    }

    return (
      <div className={block}
           id={`event-${event.get('id')}`}>

        <TimeIndicator event={event} />

        <div className={className}>
          <div className={`${block}__background`}
               style={{ background }}/>

          <div className={`${block}__left-border`}
               style={{ background }}/>

          <div className={`${block}__content-wrapper`}>
            <DetailsHeader event={event}
                           iconType={isExpanded ? 'timeline_close' : 'timeline_open'}
                           color={background}
                           onClick={() => this.setState({ isExpanded: !isExpanded })} />
            {isExpanded
              ? <div className={`${block}__border`}
                     style={{ background }}/>
              : null
            }
            {isExpanded
              ? <div className={`${block}__expanded-details`}>
                  <ProblemDescription event={event} />
                  <EventChart event={event} />
                  <EventDependecyGraph event={event} />
                  <EventTraces event={event} />
                </div>
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}));

function TimeIndicator({event}) {
  return (
    <div className={`${block}__time-indicator`}>
      <span className={`${block}__time`}>
        {formatTime(event.get('start'))}
      </span>
      <div className={`${block}__line`} />
      <div className={`${block}__dot`} />
    </div>
  );
}

function DetailsHeader({event, onClick, iconType}) {
  const className = `${block}__heading`;

  return (
    <div className={className}
         id={`event-${event.get('id')}`}
         onClick={onClick}>

      <div className={`${block}__left`}>
        <EventIcon event={event}
                   className={`${block}__icon`} />
        <div>
          {event.getIn(['problem', 'problemText'])}
          <EntityInformation event={event} />
        </div>
      </div>

      <SvgIcon type={iconType}
               width={12}
               color='#7b8e96' />
    </div>
  );
}
