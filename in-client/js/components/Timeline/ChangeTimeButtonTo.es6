import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {timeframe, timeframeShape} from 'in-stores/timeline';
import {formatDateTime} from 'in-services/formatters/date';
import ServerTime from 'in-components/ServerTime';
import {serverTime} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import {
  changeTimeButtonToSelected,
  setChangeTimeButtonToSelected,
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
    changeTimeButtonToSelected,
    selectedTimeRange,
    serverTime,
    timeframe
  },
  React.createClass({

    displayName: 'ChangeTimeButtonTo',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      changeTimeButtonToSelected: rpt.bool,
      selectedTimeRange: rpt.string,
      timeframe: timeframeShape,
      serverTime: rpt.number
    },

    render() {
      return (
        <div>
          {this.props.changeTimeButtonToSelected ?
            <TimePicker className={block + '__timepicker--right'}
                        onClose={clearChangeTimeButtonToSelected} />
            : null
          }
          <div className={block + (this.props.changeTimeButtonToSelected ? ' ' + block + '__selected' : '')}
               onClick={() => {
                 if (this.props.changeTimeButtonToSelected) {
                   clearChangeTimeButtonToSelected();
                 } else {
                   clearChangeTimeButtonFromSelected();
                   setChangeTimeButtonToSelected();
                 }
               }}>
            {this.props.selectedTimeRange === TIME_RANGES.FIXED ?
              formatDateTime(this.props.timeframe.to) :
              <ServerTime format={formatDateTime}/>}
          </div>
        </div>
      );
    }
  })
);
