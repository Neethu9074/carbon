import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import React from 'react';

import ServerTime from 'in-components/ServerTime';
import {timeframe} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import {
  changeTimeButtonFromSelected,
  setChangeTimeButtonFromSelected,
  clearChangeTimeButtonToSelected,
  clearChangeTimeButtonFromSelected
} from './stores';
import TimePicker from './TimePicker';

import './ChangeTimeButton.less';


const block = 'in-timeline-change-time-button';
const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      changeTimeButtonFromSelected,
      timeframe
    };
  },
  React.createClass({

    displayName: 'ChangeTimeButtonFrom',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      changeTimeButtonFromSelected: rpt.bool,
      timeframe: rpt.object
    },

    render() {
      return (
        <div>
          {this.props.changeTimeButtonFromSelected ?
            <TimePicker className={block + '__timepicker__left'} /> : null}
          <div className={block + (this.props.changeTimeButtonFromSelected ? ' ' + block + '__selected' : '')}
               onClick={() => {
                 if (this.props.changeTimeButtonFromSelected) {
                   clearChangeTimeButtonFromSelected();
                 } else {
                   clearChangeTimeButtonToSelected();
                   setChangeTimeButtonFromSelected();
                 }
               }}>
            {this.props.timeframe.to ?
              moment(this.props.timeframe.to.getTime() - this.props.timeframe.windowSize)
                .format('YYYY-MM-DD, HH:mm:ss') :
              <ServerTime format='YYYY-MM-DD, HH:mm:ss' offset={this.props.timeframe.windowSize * -1}/>
            }
          </div>
        </div>
      );
    }
  })
);
