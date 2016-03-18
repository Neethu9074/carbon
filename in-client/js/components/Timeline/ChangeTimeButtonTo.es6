import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import React from 'react';

import ServerTime from 'in-components/ServerTime';
import {serverTime} from 'in-stores/serverTime';
import {timeframe} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import {
  changeTimeButtonToSelected,
  setChangeTimeButtonToSelected,
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
      changeTimeButtonToSelected,
      serverTime,
      timeframe
    };
  },
  React.createClass({

    displayName: 'ChangeTimeButtonFrom',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      changeTimeButtonToSelected: rpt.bool,
      serverTime: rpt.number,
      timeframe: rpt.object
    },

    render() {
      return (
        <div>
          {this.props.changeTimeButtonToSelected ?
            <TimePicker className={block + '__timepicker__right'} /> : null}
          <div className={block + (this.props.changeTimeButtonToSelected ? ' ' + block + '__selected' : '')}
               onClick={() => {
                 if (this.props.changeTimeButtonToSelected) {
                   clearChangeTimeButtonToSelected();
                 } else {
                   clearChangeTimeButtonFromSelected();
                   setChangeTimeButtonToSelected();
                 }
               }}>
            {this.props.timeframe.to ?
              moment(this.props.timeframe.to).format('YYYY-MM-DD, HH:mm:ss') :
              <ServerTime format='YYYY-MM-DD, HH:mm:ss'/>}
          </div>
        </div>
      );
    }
  })
);
