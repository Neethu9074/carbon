import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDurationMarker from 'in-views/eventView/components/marker/EventDurationMarker';
import EventDependecyGraph from 'in-views/eventView/components/EventDependecyGraph';
import ProblemDescription from 'in-views/eventView/components/ProblemDescription';
import {highlightedEventId$} from 'in-views/eventView/stores/highlightedEvent';
import EndedMarker from 'in-views/eventView/components/marker/EndedMarker';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EventTraces from 'in-views/eventView/components/EventTraces';
import Spacer from 'in-views/eventView/components/Incident/Spacer';
import EventChart from 'in-views/eventView/components/EventChart';
import EntityInformation from 'in-components/EntityInformation';
import Marker from 'in-views/eventView/components/Marker';
import {getFixedTimeframeUrl} from 'in-stores/navigation';
import {formatTime} from 'in-services/formatters/date';
import EventIcon from 'in-components/EventIcon';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-views/eventView/components/Incident/EventListItem.less';


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
    triggeringProblemId: rpt.string,
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
    const triggeringProblemId = this.props.triggeringProblemId;
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

    const isTriggeringEvent = triggeringProblemId === event.getIn(['problem', 'id']);

    return (
      <div className={className}
           id={`event-${event.get('id')}`}>

        {(hasServiceImpact)
          ? <Marker className={`${block}__affected-service-marker`}
                    label='service impact'
                    event={event} />
          : null
        }

        {isTriggeringEvent
          ? <Marker className={`${block}__triggering-event-marker`}
                    label='triggering event'
                    event={event} />
          : null
        }

        <TimeIndicator event={event} />

        <div className={rightClassName}>
          <div className={`${block}__background`}
               style={{ background }} />

          <div className={`${block}__left-border`}
               style={{ background }} />

          <div className={`${block}__content-wrapper`}>
            <DetailsHeader event={event}
                           iconType={isExpanded ? 'timeline_close' : 'timeline_open'}
                           background={background}
                           onClick={() => this.setState({ isExpanded: !isExpanded })} />
            {isExpanded
              ? <div className={`${block}__border`}
                     style={{ background }} />
              : null
            }
            {isExpanded ?
              <div className={`${block}__expanded-details`}>
                <ProblemDescription event={event} />
                <Spacer />
                <EventChart event={event} />
                <Spacer />
                <EventDependecyGraph event={event} />
                <Spacer />
                <EventTraces event={event} />
              </div>
            : null}
          </div>
        </div>
      </div>
    );
  }
}));

const TimeIndicator = connectTo(props => {
  return {
    href: getFixedTimeframeUrl({focusedMoment: props.event.get('start')})
  };
},
function TimeIndicator({event, href}) {
  return (
    <div className={`${block}__time-indicator`}>
      <a href={href}>
        <span className={`${block}__time`}>
          {formatTime(event.get('start'))}
        </span>
      </a>
      <div className={`${block}__line`} />
      <div className={`${block}__dot`} />
    </div>
  );
});

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
          <div>
            <span className={`${block}__problem-text`}>
              {event.getIn(['problem', 'problemText'])}
            </span>
            <EndedMarker event={event} />
            <EventDurationMarker event={event} />
          </div>
          <EntityInformation snapshotId={event.getIn(['problem', 'snapshotId'])}
                             time={event.get('start')} />
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
