import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDetailsContent from 'in-components/eventView/components/eventDetails/EventDetailContent';
import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import EventDuration from 'in-components/eventView/components/eventDetails/EventDuration';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EventIcon from 'in-components/EventIcon/EventIcon';
import {formatTime} from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './CollapsableEventDetails.less';


const rpt = React.PropTypes;
const block = 'in-event-view-event-details';

export default connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae')
  };
},
React.createClass({

  displayName: 'CollapsableEventDetails',

  propTypes: {
    event: irpt.map.isRequired,
    withEventHeader: rpt.bool,
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

    let headerClassName = `${block}__header`;
    if (isCollapsed) {
      headerClassName += ` ${headerClassName}--collapsed`;
    }

    return (
      <div className={block}>
        <TimeIndicator event={event} />
        <div className={`${block}__right`}
             style={{ borderLeft: `5px solid ${color}` }}>

          {this.heading(event, isCollapsed)}

          {isCollapsed
            ? null
            : <EventDetailsContent event={event}/>
          }
        </div>
      </div>
    );
  },

  heading(event, isCollapsed) {
    let headerClassName = `${block}__header`;
    if (isCollapsed) {
      headerClassName += ` ${headerClassName}--collapsed`;
    }

    return (
      <div className={headerClassName}
           onClick={() => this.setState({isCollapsed: !isCollapsed})}>

        <div className={`${block}__flex-wrapper`}>
          <EventIcon event={event}
                     className={`${block}__icon`} />

          <div>
            <div className={`${block}__flex-wrapper`}>
              <span className={`${block}__title`}>
                {event.get('title')}
              </span>
              <EventDuration event={event} />
              {event.get('state') === 'open'
                ? null
                : <span className={`${block}__end`}>
                    {`(${formatTime(event.get('end'))})`}
                  </span>
              }
            </div>
            <EntityInformation event={event} />
          </div>
        </div>

        <SvgIcon type={isCollapsed ? 'plus_without_frame' : 'minus'}
                 width={10}
                 height={10}
                 color='#7b8e96' />
      </div>
    );
  }
}));

function TimeIndicator({event}) {
  return (
    <div className={`${block}__time-indicator`}>
      <div className={`${block}__time`}>
        {formatTime(event.get('start'))}
      </div>
      <div className={`${block}__line`} />
      <div className={`${block}__dot`} />
    </div>
  );
}
