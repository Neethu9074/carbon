import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  isCollapsed$,
  toggleMenu,
  showTimeSelector$,
  toggleShowTimeSelector
} from 'in-components/timeline/timelineStore';
import {serverTime$} from 'in-stores/serverTime';
import TimelineMenuEventLine from 'in-components/timeline/components/TimelineMenuEventLine';
import TimelineSelectedTime from 'in-components/timeline/components/TimelineSelectedTime';
import TimelineLiveButton from 'in-components/timeline/components/TimelineLiveButton';
import {setTo, setFocusedMoment, timeframeShape} from 'in-stores/timeline';
import DatePicker from 'in-components/timeline/components/DatePicker';
import {timeframe$} from 'in-components/timeline/timelineStore';
import {eventsInTimeframe$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineMenu.less';


const block = 'in-timeline-menu';
const rpt = React.PropTypes;

export default connectTo({
    categorizedEvents: eventsInTimeframe$,
    showTimeSelector: showTimeSelector$,
    isCollapsed: isCollapsed$,
    timeframe: timeframe$
  },
  React.createClass({

    displayName: 'TimelineMenu',

    mouseIsOnTimePicker: false,

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      categorizedEvents: rpt.object,
      showTimeSelector: rpt.bool,
      timeframe: timeframeShape,
      isCollapsed: rpt.bool
    },

    render() {
      const events = this.props.categorizedEvents;

      return (
        <div className={block}>
          <div className={block + '__heading'}>
            {this.props.showTimeSelector ?
              <DatePicker applyDate={this.applyDate}
                          onClose={toggleShowTimeSelector}/>
               : null
             }
            <TimelineSelectedTime/>
            <TimelineLiveButton/>
          </div>

          <TimelineMenuEventLine title={'Incidents'}
                                 count={events ? events.incidents.length : 0}
                                 additionalContent={
                                   <Icon type={'timeline_' + (this.props.isCollapsed ? 'open' : 'close')}
                                         className={block + '__icon'}
                                         onClick={toggleMenu}/>
                                 }/>

          <TimelineMenuEventLine title={'Issues'}
                                 count={events ? events.issues.length : 0}/>

          <TimelineMenuEventLine title={'Changes'}
                                 count={events ? events.changes.length : 0}/>
        </div>
      );
    },

    applyDate(date) {
      if (this.props.timeframe) {
        serverTime$.once(serverTime => {
          const focusedMoment = Math.min(serverTime, Date.parse(date));
          if (focusedMoment) {
            setFocusedMoment(focusedMoment);
            setTo(focusedMoment + this.props.timeframe.windowSize / 2);
          }
        });
      }
    }
  })
);
