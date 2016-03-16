import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
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
      timeframe
    };
  },
  React.createClass({

    displayName: 'ChangeTimeButtonFrom',

    mixins: [
      SubscriptionMixin,
      PureRenderMixin
    ],

    propTypes: {
      changeTimeButtonToSelected: rpt.bool,
      timeframe: rpt.object
    },

    render() {
      return (
        <div>
          {this.props.changeTimeButtonToSelected ?
            <TimePicker className={block + '__timepicker' + ' ' + block + '__timepicker__right'} /> : null}
          <div className={block + (this.props.changeTimeButtonToSelected ? ' ' + block + '__selected' : '')}
               onClick={() => {
                 if (this.props.changeTimeButtonToSelected) {
                   clearChangeTimeButtonToSelected();
                 } else {
                   clearChangeTimeButtonFromSelected();
                   setChangeTimeButtonToSelected();
                 }
               }}>
            {moment(this.props.timeframe.to).format('DD/MM/YY, HH:mm:ss')}
          </div>
        </div>
      );
    }
  })
);
