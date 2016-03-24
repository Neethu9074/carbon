import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import ServerTime from 'in-components/ServerTime';
import {timeframe} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import {
  changeTimeButtonFromSelected,
  setChangeTimeButtonFromSelected,
  clearChangeTimeButtonToSelected,
  clearChangeTimeButtonFromSelected,
  selectedTimeRange,
  TIME_RANGES
} from './timelineStores';
import TimePicker from './TimePicker';

import './ChangeTimeButton.less';


const block = 'in-timeline-change-time-button';
const rpt = React.PropTypes;

export default connectTo({
    changeTimeButtonFromSelected,
    selectedTimeRange,
    timeframe
  },
  React.createClass({

    displayName: 'ChangeTimeButtonFrom',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      changeTimeButtonFromSelected: rpt.bool,
      selectedTimeRange: rpt.string,
      timeframe: rpt.object
    },

    render() {
      return (
        <div>
          {this.props.changeTimeButtonFromSelected ?
            <TimePicker className={block + '__timepicker--left'} /> : null}
          <div className={block + (this.props.changeTimeButtonFromSelected ? ' ' + block + '__selected' : '')}
               onClick={() => {
                 if (this.props.changeTimeButtonFromSelected) {
                   clearChangeTimeButtonFromSelected();
                 } else {
                   clearChangeTimeButtonToSelected();
                   setChangeTimeButtonFromSelected();
                 }
               }}>
            {this.props.selectedTimeRange === TIME_RANGES.FIXED ?
              formatDateTime(this.props.timeframe.to - this.props.timeframe.windowSize) :
              <ServerTime format={formatDateTime} offset={this.props.timeframe.windowSize * -1}/>
            }
          </div>
        </div>
      );
    }
  })
);
