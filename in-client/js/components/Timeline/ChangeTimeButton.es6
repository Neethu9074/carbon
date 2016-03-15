import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import './ChangeTimeButton.less';


const block = 'in-timeline-change-time-button';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'ChangeTimeButton',

  mixins: [
    SubscriptionMixin,
    PureRenderMixin
  ],

  propTypes: {
    toggleTimePicker: rpt.func,
    label: rpt.string,
    align: rpt.string
  },

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    return (
      <div>
        <div className={block + (this.state.open ? ' ' + block + '__open' : '')}
             onClick={this.toggleTimePicker}>
          {this.props.label}
        </div>
      </div>
    );
  },

  toggleTimePicker() {
    this.setState({ open: !this.state.open });
    this.props.toggleTimePicker();
  }
});
