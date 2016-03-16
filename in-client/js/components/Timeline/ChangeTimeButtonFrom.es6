import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import connectTo from 'in-hoc/connectTo';

import {
  selectedDateFrom,
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
      selectedDateFrom
    };
  },
  React.createClass({

    displayName: 'ChangeTimeButtonFrom',

    mixins: [
      SubscriptionMixin,
      PureRenderMixin
    ],

    propTypes: {
      changeTimeButtonFromSelected: rpt.bool,
      selectedDateFrom: rpt.any
    },

    render() {
      return (
        <div>
          {this.props.changeTimeButtonFromSelected ?
            <TimePicker className={block + '__timepicker' + ' ' + block + '__timepicker__left'} /> : null}
          <div className={block + (this.props.changeTimeButtonFromSelected ? ' ' + block + '__selected' : '')}
               onClick={() => {
                 if (this.props.changeTimeButtonFromSelected) {
                   clearChangeTimeButtonFromSelected();
                 } else {
                   clearChangeTimeButtonToSelected();
                   setChangeTimeButtonFromSelected();
                 }
               }}>
            {this.props.selectedDateFrom.toLocaleString()}
          </div>
        </div>
      );
    }
  })
);
