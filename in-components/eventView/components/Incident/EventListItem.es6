import irpt from 'react-immutable-proptypes';
import React from 'react';

import AffectedServiceMarker from 'in-components/eventView/components/AffectedServiceMarker';
import EventDependecyGraph from 'in-components/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-components/eventView/components/ProblemDescription';
import EntityInformation from 'in-components/eventView/components/EntityInformation';
import {highlightedEventId$} from 'in-components/eventView/stores/highlightedEvent';
import EventDuration from 'in-components/eventView/components/EventDuration';
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

    let rightClassName = `${block}__right`;
    if (this.props.highlightedEventId === event.get('id')) {
      rightClassName += ` ${rightClassName}--highlighted`;
    }

    const hasServiceImpact = event.get('affectedService');
    let className = block;
    if (hasServiceImpact) {
      className += ` ${className}__service-impact`;
    }

    return (
      <div className={className}
           id={`event-${event.get('id')}`}>

        {hasServiceImpact
          ? <AffectedServiceMarker className={`${block}__affected-service-marker`} />
          : null
        }

        <TimeIndicator event={event} />

        <div className={rightClassName}>
          <div className={`${block}__background`}
               style={{ background }}/>

          <div className={`${block}__left-border`}
               style={{ background }}/>

          <div className={`${block}__content-wrapper`}>
            <DetailsHeader event={event}
                           iconType={isExpanded ? 'timeline_close' : 'timeline_open'}
                           background={background}
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

function DetailsHeader({event, onClick, iconType, background}) {
  const className = `${block}__heading`;

  return (
    <div className={className}
         id={`event-${event.get('id')}`}
         onClick={onClick}>

      <div className={`${block}__left`}>
        <div className={`${block}__icon-wrapper`}
             style={{ background }}>
          <EventIcon event={event}
                     color='#ffffff'
                     size={14} />
        </div>

        <div>
          <span className={`${block}__problem-text`}>
            {event.getIn(['problem', 'problemText'])}
          </span>
          <EventDuration event={event} />
          <EntityInformation event={event} />
        </div>
      </div>

      <SvgIcon className={`${block}__expand-icon`}
               type={iconType}
               height={12}
               width={12}
               color='#7b8e96' />
    </div>
  );
}
