import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import connectTo from 'in-hoc/connectTo';

import {
  selectedDateTo,
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
      selectedDateTo
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
      selectedDateTo: rpt.any
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
            {this.props.selectedDateTo.toLocaleString()}
          </div>
        </div>
      );
    }
  })
);
